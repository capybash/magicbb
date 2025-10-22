import Component from 'flarum/common/Component';

const CHOICES = [
  { key: 'left',   icon: 'fas fa-align-left',   title: 'Left' },
  { key: 'center', icon: 'fas fa-align-center', title: 'Center' },
  { key: 'right',  icon: 'fas fa-align-right',  title: 'Right' },
];

export default class ImageAlignPopover extends Component {
  oninit() {
    this.isOpen = false;
    this.anchor = null;
    this.popover = null;

    this._onDocClick = (e) => {
      if (!this.isOpen) return;
      const pop = this.popover;
      const anc = this.anchor;
      if (!pop || !anc) return;
      if (!pop.contains(e.target) && !anc.contains(e.target)) this.close();
    };

    this._onKey = (e) => {
      if (e.key === 'Escape') this.close();
    };
  }

  onremove() {
    document.removeEventListener('mousedown', this._onDocClick);
    document.removeEventListener('keydown', this._onKey);
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    document.addEventListener('mousedown', this._onDocClick);
    document.addEventListener('keydown', this._onKey);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    document.removeEventListener('mousedown', this._onDocClick);
    document.removeEventListener('keydown', this._onKey);
    m.redraw();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  view(vnode) {
    const label = vnode.attrs.label || 'Image';
    const icon = vnode.attrs.icon || 'fas fa-images';
    const onPick = vnode.attrs.onPick || function () {};

    const trigger = m(
      'button.Button.Button--icon',
      {
        type: 'button',
        title: label,
        'aria-haspopup': 'dialog',
        'aria-expanded': String(this.isOpen),
        onclick: (e) => {
          e.preventDefault();
          this.toggle();
          e.currentTarget.blur();
        },
        oncreate: (v) => { this.anchor = v.dom; },
        style: 'background:transparent;box-shadow:none;transform:none;',
      },
      m('i', { className: 'icon ' + icon, 'aria-hidden': 'true' })
    );

    let style = null;
    if (this.isOpen && this.anchor) {
      const r = this.anchor.getBoundingClientRect();
      style = {
        position: 'fixed',
        left: (r.left + r.width / 2) + 'px',
        top: r.top + 'px',
        transform: 'translate(-50%, calc(-100% - 8px))',
      };
    }

    const popover = this.isOpen
      ? m('div.Magicbb-ImagePopover',
          {
            style,
            oncreate: (v) => { this.popover = v.dom; },
            onremove: () => { this.popover = null; },
          },
          m('div.Magicbb-ImageGrid',
            CHOICES.map((c) =>
              m(
                'button.Magicbb-ImageChoice',
                {
                  type: 'button',
                  title: c.title,
                  'aria-label': c.title,
                  onclick: (e) => {
                    e.preventDefault();
                    onPick(c.key);
                    this.close();
                  },
                },
                m('i', { className: 'icon ' + c.icon, 'aria-hidden': 'true' })
              )
            )
          )
        )
      : null;

    return [trigger, popover];
  }
}