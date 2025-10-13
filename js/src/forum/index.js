import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import styleSelectedText from 'flarum/common/utils/styleSelectedText';
import m from 'mithril';

import ColorPalettePopover, { DEFAULT_COLORS } from './components/ColorPalettePopover';
import AlertPickerPopover from './components/AlertPickerPopover';
import ImageAlignPopover from './components/ImageAlignPopover';

function elOf(ctx) {
  return ctx?.attrs?.composer?.editor?.el || null;
}
function edOf(ctx) {
  return ctx?.attrs?.composer?.editor || null;
}
function on(key) {
  const v = app.forum.attribute(key);
  return v === undefined || v === null ? true : !!v;
}
function findFoFTagAroundSelection(node) {
  const re = /\[upl-image-preview(?:(?!]).)*?\burl=(?:"[^"]+"|'[^']+'|[^\s\]]+)(?:(?!]).)*?](?:\s*\[\/upl-image-preview])?/i;
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

    const addBtn = (key, icon, title, style, prio, defaultText = '') => {
      items.add(
        key,
        m(TextEditorButton, {
          icon,
          title,
          onclick: (e) => {
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
          },
        }),
        prio
      );
    };

    if (on('bb_center')) {
      addBtn(
        'bb-center',
        'fas fa-align-center',
        app.translator.trans('capybash-magicbb.forum.composer.center_button'),
        { prefix: '[center]', suffix: '[/center]', trimFirst: true, multiline: true },
        100
      );
    }

    if (on('bb_justify')) {
      addBtn(
        'bb-justify',
        'fas fa-align-justify',
        app.translator.trans('capybash-magicbb.forum.composer.justify_button'),
        { prefix: '[justify]', suffix: '[/justify]', trimFirst: true, multiline: true },
        99
      );
    }

    if (on('bb_color')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.color_button');
      items.add(
        'bb-color',
        m(ColorPalettePopover, {
          label,
          colors: DEFAULT_COLORS,
          onSelect: (hex) => {
            const node = el();
            const ed = editor();
            if (!node || !ed) return;

            const hasSelection = node.selectionStart !== node.selectionEnd;
            const style = { prefix: `[color=${hex}]`, suffix: '[/color]' };

            if (!hasSelection) {
              ed.insertAtCursor(`${style.prefix}Heading${style.suffix}`);
            } else {
              styleSelectedText(node, style);
            }
          },
        }),
        98
      );
    }

    if (on('bb_spoiler')) {
      addBtn(
        'bb-spoiler',
        'fas fa-layer-group',
        app.translator.trans('capybash-magicbb.forum.composer.spoiler_button'),
        { prefix: '[spoiler title=Heading]', suffix: '[/spoiler]' },
        97,
        'Subtitle'
      );
    }

    if (on('bb_table')) {
      items.add(
        'bb-table',
        m(TextEditorButton, {
          icon: 'fas fa-table',
          title: app.translator.trans('capybash-magicbb.forum.composer.table_button'),
          onclick: (e) => {
            e?.preventDefault?.();
            const ed = editor();
            if (!ed?.insertAtCursor) return;
            const tpl =
              '| Heading 1 | Heading 2 | Heading 3 |\n' +
              '|---|---|---|\n' +
              '| Cell 1 | Cell 2 | Cell 3 |\n' +
              '| Cell 4 | Cell 5 | Cell 6 |';
            ed.insertAtCursor(tpl);
          },
        }),
        96
      );
    }

    if (on('bb_info')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.info_button');
      items.add(
        'bb-info',
        m(AlertPickerPopover, {
          label,
          onSelect: (a) => {
            const node = el();
            const ed = editor();
            if (!node || !ed) return;

            const hasSelection = node.selectionStart !== node.selectionEnd;
            const tag = a.key;
            const prefix = `[${tag} title=Heading font=${a.font} bg=${a.bg} border=${a.border}]`;
            const suffix = `[/${tag}]`;

            if (!hasSelection) {
              ed.insertAtCursor(`${prefix}Subtitle${suffix}`);
            } else {
              styleSelectedText(node, { prefix, suffix });
            }
          },
        }),
        95.5
      );
    }

    if (on('bb_image')) {
      const label = app.translator.trans('capybash-magicbb.forum.composer.image_button');
      items.add(
        'bb-image',
        m(ImageAlignPopover, {
          label,
          onPick: (align) => {
            const node = el();
            const ed = editor();
            if (!node || !ed) return;

            const wrap = (tag) => ({ prefix: `[${tag}]`, suffix: `[/${tag}]` });
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
        }),
        95
      );
    }
  });
});