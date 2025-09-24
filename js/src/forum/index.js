import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import styleSelectedText from 'flarum/common/utils/styleSelectedText';
import m from 'mithril';

app.initializers.add('capybash-magicbb-buttons', () => {
  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    const el = () => this.attrs?.composer?.editor?.el;
    const editor = () => this.attrs?.composer?.editor;

    const on = (key) => {
      const v = app.forum.attribute(key);
      return v === undefined || v === null ? true : !!v;
    };

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
      addBtn(
        'bb-color',
        'fas fa-palette',
        app.translator.trans('capybash-magicbb.forum.composer.color_button'),
        { prefix: '[color=#FF0000]', suffix: '[/color]' },
        98,
        'Heading'
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
      addBtn(
        'bb-info',
        'fas fa-circle-info',
        app.translator.trans('capybash-magicbb.forum.composer.info_button'),
        { prefix: '[info title=Heading]', suffix: '[/info]' },
        95,
        'Subtitle'
      );
    }

    if (on('bb_ileft')) {
      addBtn(
        'bb-ileft',
        'fas fa-arrow-left',
        app.translator.trans('capybash-magicbb.forum.composer.ileft_button'),
        { prefix: '[ileft]', suffix: '[/ileft]' },
        94
      );
    }

    if (on('bb_iright')) {
      addBtn(
        'bb-iright',
        'fas fa-arrow-right',
        app.translator.trans('capybash-magicbb.forum.composer.iright_button'),
        { prefix: '[iright]', suffix: '[/iright]' },
        93
      );
    }
  });
});