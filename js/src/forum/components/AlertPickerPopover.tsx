import Component from 'flarum/common/Component';
import app from 'flarum/forum/app';

const ALERTS = [
  { key: 'info',    icon: 'fas fa-circle-info',          font: '#1d4ed8', bg: '#eff6ff', border: '#60a5fa' },
  { key: 'success', icon: 'fas fa-check',                 font: '#047857', bg: '#ecfdf5', border: '#34d399' },
  { key: 'warning', icon: 'fas fa-triangle-exclamation',  font: '#b45309', bg: '#fffbeb', border: '#fbbf24' },
  { key: 'error',   icon: 'fas fa-xmark',                 font: '#b91c1c', bg: '#fef2f2', border: '#f87171' },
];

export default class AlertPickerPopover extends Component {
  oninit() {
    this.open = false;
    this.anchor = null;

    this._onDocClick = (e) => {
      if (!this.open) return;
      const pop = this.popoverEl;
      if (!pop) return;
      if (!pop.contains(e.target) && !this.anchor?.contains(e.target)) this.close();
    };
    this._onKey = (e) => { if (e.key === 'Escape') this.close(); };
  }

  onremove() {
    document.removeEventListener('mousedown', this._onDocClick);
    document.removeEventListener('keydown', this._onKey);
  }

  toggle() {
    this.open = !this.open;
    const add = document.addEventListener.bind(document);
    const rm  = document.removeEventListener.bind(document);
    if (this.open) {
      add('mousedown', this._onDocClick);
      add('keydown', this._onKey);
    } else {
      rm('mousedown', this._onDocClick);
      rm('keydown', this._onKey);
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
    const { label, onSelect } = vnode.attrs;
    const iconSetting = app.forum.attribute<string>('capybash-magicbb.icon_info');
    const icon = iconSetting || vnode.attrs.icon || 'fas fa-circle-exclamation';

    const trigger = m(
      'button.Button.Button--icon',
      {
        type: 'button',
        title: label,
        'aria-haspopup': 'dialog',
        'aria-expanded': String(this.open),
        style: 'background:transparent;box-shadow:none;transform:none;',
        onclick: (e) => { e.preventDefault(); this.toggle(); e.currentTarget.blur(); },
        oncreate: (v) => (this.anchor = v.dom),
      },
      m('i', { className: `icon ${icon}`, 'aria-hidden': 'true' })
    );

    let style = null;
    if (this.open && this.anchor) {
      const r = this.anchor.getBoundingClientRect();
      style = { position: 'fixed', left: `${r.left + r.width / 2}px`, top: `${r.top}px`, transform: 'translate(-50%, calc(-100% - 8px))' };
    }

    return m.fragment({ key: 'magicbb-alert' }, [
      trigger,
      this.open &&
        m('div.Magicbb-AlertPopover',
          {
            style,
            oncreate: (v) => (this.popoverEl = v.dom),
            onremove: () => (this.popoverEl = null),
          },
          m('div.Magicbb-AlertGrid',
            ALERTS.map((a) =>
              m('button.Magicbb-AlertChoice',
                {
                  type: 'button',
                  title: a.key,
                  'aria-label': a.key,
                  style: `background:${a.font}`,
                  onclick: (e) => { e.preventDefault(); onSelect?.(a); this.close(); },
                },
                m('i', { className: `icon ${a.icon}`, 'aria-hidden': 'true', style: 'color:#fff' })
              )
            )
          )
        ),
    ]);
  }
}

export { ALERTS };