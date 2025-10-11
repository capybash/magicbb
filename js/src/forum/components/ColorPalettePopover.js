import Component from 'flarum/common/Component';
import m from 'mithril';

const DEFAULT_COLORS = [
  '#FF4D4D', '#FF8A3D', '#FFD53D', '#22C55E',
  '#06B6D4', '#3B82F6', '#4F46E5', '#A855F7',
  '#EB8A90', '#DED9E2', '#536873', '#FEFEE3',
  '#2F3437', '#6B3F2B', '#121212', '#7F1D1D',
];

export default class ColorPalettePopover extends Component {
  oninit() {
    this.open = false;
    this.anchor = null;

    this._onDocClick = (e) => {
      if (!this.open) return;
      const pop = this.popoverEl;
      if (!pop) return;
      if (!pop.contains(e.target) && !this.anchor?.contains(e.target)) this.close();
    };

    this._onKey = (e) => {
      if (e.key === 'Escape') this.close();
    };
  }

  onremove() {
    document.removeEventListener('mousedown', this._onDocClick);
    document.removeEventListener('keydown', this._onKey);
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      document.addEventListener('mousedown', this._onDocClick);
      document.addEventListener('keydown', this._onKey);
    } else {
      document.removeEventListener('mousedown', this._onDocClick);
      document.removeEventListener('keydown', this._onKey);
    }
  }

  close() {
    if (!this.open) return;
    this.open = false;
    document.removeEventListener('mousedown', this._onDocClick);
    document.removeEventListener('keydown', this._onKey);
    m.redraw();
  }

  view(vnode) {
    const { label, icon = 'fas fa-palette', colors = DEFAULT_COLORS, onSelect } = vnode.attrs;

    const trigger = m(
      'button.Button.Button--icon',
      {
        type: 'button',
        title: label,
        'aria-haspopup': 'dialog',
        'aria-expanded': String(this.open),
        style: 'background:transparent;box-shadow:none;transform:none;',
        onclick: (e) => {
          e.preventDefault();
          this.toggle();
          e.currentTarget.blur();
        },
        oncreate: (v) => (this.anchor = v.dom),
      },
      m('i', { className: `icon ${icon}`, 'aria-hidden': 'true' })
    );

    let style = null;
    if (this.open && this.anchor) {
      const r = this.anchor.getBoundingClientRect();
      style = {
        position: 'fixed',
        left: `${r.left + r.width / 2}px`,
        top: `${r.top}px`,
        transform: 'translate(-50%, calc(-100% - 8px))',
      };
    }

    return m.fragment({ key: 'magicbb-color' }, [
      trigger,
      this.open &&
        m(
          'div.Magicbb-ColorPopover',
          {
            style,
            oncreate: (v) => (this.popoverEl = v.dom),
            onremove: () => (this.popoverEl = null),
          },
          m(
            'div.Magicbb-ColorGrid',
            (colors || DEFAULT_COLORS).map((hex) =>
              m('button.Magicbb-Color', {
                type: 'button',
                title: hex,
                'aria-label': hex,
                style: `background:${hex}`,
                onclick: (e) => {
                  e.preventDefault();
                  onSelect?.(hex);
                  this.close();
                },
              })
            )
          )
        ),
    ]);
  }
}

export { DEFAULT_COLORS };