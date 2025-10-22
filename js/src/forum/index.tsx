import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import styleSelectedText from 'flarum/common/utils/styleSelectedText';
import ColorPalettePopover, { DEFAULT_COLORS } from './components/ColorPalettePopover';
import AlertPickerPopover from './components/AlertPickerPopover';
import ImageAlignPopover from './components/ImageAlignPopover';
import MoreButtonsPopover from './components/MoreButtonsPopover';

function elOf(ctx) {
  return ctx?.attrs?.composer?.editor?.el || null;
}
function edOf(ctx) {
  return ctx?.attrs?.composer?.editor || null;
}
function featureOn(key) {
  const v = app.forum.attribute(key);
  return v === undefined || v === null ? true : !!v;
}
function findFoFTagAroundSelection(node) {
  const re = /\[upl-image-preview(?:(?!]).)*?\burl=(?:"[^"]+"|'[^']+'|[^\s\]]+)(?:(?!]).)*?]/i;
  const start = Math.max(0, node.selectionStart - 800);
  const end = Math.min(node.value.length, node.selectionEnd + 800);
  const slice = node.value.slice(start, end);
  const m = slice.match(re);
  if (!m) return null;
  const absStart = start + m.index;
  const absEnd = absStart + m[0].length;
  return { start: absStart, end: absEnd, text: m[0] };
}
function replaceRange(node, from, to, text) {
  node.setRangeText(text, from, to, 'end');
  node.dispatchEvent(new Event('input', { bubbles: true }));
}

app.initializers.add('capybash-magicbb-buttons', () => {
  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    const el = () => elOf(this);
    const editor = () => edOf(this);
    const grouped = featureOn('bb_toolbar_group');

    type PoolItem =
      | {
          key: string;
          prio: number;
          title: string;
          icon?: string;
          vnode: Mithril.Children;
          asMenu: () => { key: string; title: string; icon?: string; onClick: (e: MouseEvent) => void };
        }
      | {
          key: string;
          prio: number;
          title: string;
          icon?: string;
          vnode: Mithril.Children;
          asMenuSub: () => { key: string; title: string; icon?: string; renderSub: () => Mithril.Children };
        };

    const iconOf = (name: string, fallback: string) =>
      (app.forum.attribute(`icon_${name}`) as string) || fallback;

    const pool: PoolItem[] = [];

    const addBtn = (key, icon, title, style, prio, defaultText = '') => {
      const handler = (e?: MouseEvent) => {
        e?.preventDefault?.();
        const node = el();
        const ed = editor();
        if (!node || !ed) return;

        const hasSelection = node.selectionStart !== node.selectionEnd;
        if (!hasSelection && defaultText) {
          ed.insertAtCursor((style.prefix || '') + defaultText + (style.suffix || ''));
        } else {
          styleSelectedText(node, style);
        }
      };

      pool.push({
        key,
        prio,
        title,
        icon,
        vnode: m(TextEditorButton, { icon, title, onclick: handler }),
        asMenu: () => ({ key, title, icon, onClick: handler }),
      } as PoolItem);
    };

    if (featureOn('bb_center')) {
      addBtn(
        'bb-center',
        iconOf('center', 'fas fa-align-center'),
        app.translator.trans('capybash-magicbb.forum.composer.center_button'),
        { prefix: '[center]', suffix: '[/center]', trimFirst: true, multiline: true },
        100
      );
    }

    if (featureOn('bb_justify')) {
      addBtn(
        'bb-justify',
        iconOf('justify', 'fas fa-align-justify'),
        app.translator.trans('capybash-magicbb.forum.composer.justify_button'),
        { prefix: '[justify]', suffix: '[/justify]', trimFirst: true, multiline: true },
        99
      );
    }

    if (featureOn('bb_color')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.color_button');
      const colorIcon = iconOf('color', 'fas fa-palette');

      const colorPopover = m(ColorPalettePopover, {
        label,
        icon: colorIcon,
        colors: DEFAULT_COLORS,
        onSelect: (hex: string) => {
          const node = el();
          const ed = editor();
          if (!node || !ed) return;

          const hasSelection = node.selectionStart !== node.selectionEnd;
          const style = { prefix: `[color=${hex}]`, suffix: '[/color]' };

          if (!hasSelection) ed.insertAtCursor(`${style.prefix}Heading${style.suffix}`);
          else styleSelectedText(node, style);
        },
      });

      pool.push({
        key: 'bb-color',
        prio: 98,
        title: label,
        icon: colorIcon,
        vnode: colorPopover,
        asMenuSub: () => ({
          key: 'bb-color',
          title: label,
          icon: colorIcon,
          renderSub: () => colorPopover,
        }),
      } as PoolItem);
    }

    if (featureOn('bb_spoiler')) {
      addBtn(
        'bb-spoiler',
        iconOf('spoiler', 'fas fa-layer-group'),
        app.translator.trans('capybash-magicbb.forum.composer.spoiler_button'),
        { prefix: '[spoiler title=Heading]', suffix: '[/spoiler]' },
        97,
        'Subtitle'
      );
    }

    if (featureOn('bb_table')) {
      const title = app.translator.trans('capybash-magicbb.forum.composer.table_button');
      const tableIcon = iconOf('table', 'fas fa-table');
      const handler = (e?: MouseEvent) => {
        e?.preventDefault?.();
        const ed = editor();
        if (!ed?.insertAtCursor) return;
        const tpl =
          '| Heading 1 | Heading 2 | Heading 3 |\n' +
          '|---|---|---|\n' +
          '| Cell 1 | Cell 2 | Cell 3 |\n' +
          '| Cell 4 | Cell 5 | Cell 6 |';
        ed.insertAtCursor(tpl);
      };

      pool.push({
        key: 'bb-table',
        prio: 96,
        title,
        icon: tableIcon,
        vnode: m(TextEditorButton, { icon: tableIcon, title, onclick: handler }),
        asMenu: () => ({ key: 'bb-table', title, icon: tableIcon, onClick: handler }),
      } as PoolItem);
    }

    if (featureOn('bb_info')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.info_button');
      const infoIcon = iconOf('info', 'fas fa-info-circle');

      const alertPopover = m(AlertPickerPopover, {
        label,
        icon: infoIcon,
        onSelect: (a: any) => {
          const node = el();
          const ed = editor();
          if (!node || !ed) return;

          const hasSelection = node.selectionStart !== node.selectionEnd;
          const tag = a.key;
          const prefix = `[${tag} title=Heading font=${a.font} bg=${a.bg} border=${a.border}]`;
          const suffix = `[/${tag}]`;

          if (!hasSelection) ed.insertAtCursor(`${prefix}Subtitle${suffix}`);
          else styleSelectedText(node, { prefix, suffix });
        },
      });

      pool.push({
        key: 'bb-info',
        prio: 95.5,
        title: label,
        icon: infoIcon,
        vnode: alertPopover,
        asMenuSub: () => ({
          key: 'bb-info',
          title: label,
          icon: infoIcon,
          renderSub: () => alertPopover,
        }),
      } as PoolItem);
    }

    if (featureOn('bb_image')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.image_button');
      const imageIcon = iconOf('image', 'fas fa-image');

      const imagePopover = m(ImageAlignPopover, {
        label,
        icon: imageIcon,
        onPick: (align: 'left' | 'right' | 'center') => {
          const node = el();
          const ed = editor();
          if (!node || !ed) return;

          const wrap = (tag: string) => ({ prefix: `[${tag}]`, suffix: `[/${tag}]` });
          const style =
            align === 'left' ? wrap('ileft') :
            align === 'right' ? wrap('iright') :
            wrap('icenter');

          const hasSelection = node.selectionStart !== node.selectionEnd;

          if (hasSelection) {
            styleSelectedText(node, style);
            return;
          }

          const found = findFoFTagAroundSelection(node);
          if (found) {
            const replacement = `${style.prefix}${found.text}${style.suffix}`;
            replaceRange(node, found.start, found.end, replacement);
            return;
          }

          ed.insertAtCursor(`${style.prefix}upl-image-preview uuid${style.suffix}`);
        },
      });

      pool.push({
        key: 'bb-image',
        prio: 95,
        title: label,
        icon: imageIcon,
        vnode: imagePopover,
        asMenuSub: () => ({
          key: 'bb-image',
          title: label,
          icon: imageIcon,
          renderSub: () => imagePopover,
        }),
      } as PoolItem);
    }

    pool.sort((a, b) => b.prio - a.prio);

    if (grouped) {
      const menuItems = pool.map((p) =>
        ('asMenuSub' in p ? (p as any).asMenuSub() : (p as any).asMenu())
      );

      const moreIcon = iconOf('more', 'fas fa-wand-sparkles');

      items.add(
        'bb-more',
        m(MoreButtonsPopover, {
          items: menuItems,
          label: app.translator.trans('capybash-magicbb.forum.composer.more_button'),
          icon: moreIcon,
        }),
        120
      );
    } else {
      pool.forEach((b: any) => items.add(b.key, b.vnode, b.prio));
    }
  });
});