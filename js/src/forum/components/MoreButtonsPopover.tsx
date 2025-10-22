import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';

type PlainAction = {
  key: string;
  title: string;
  icon?: string;
  onClick: (e: MouseEvent) => void;
};

type SubPopoverAction = {
  key: string;
  title: string;
  icon?: string;
  renderSub: () => Mithril.Children;
};

type MenuItem = PlainAction | SubPopoverAction;

function isSub(item: MenuItem): item is SubPopoverAction {
  return typeof (item as any).renderSub === 'function';
}

export default class MoreButtonsPopover extends Component<{ items: MenuItem[]; label?: string; icon?: string }> {
  private open = false;
  private anchor?: HTMLElement;
  private popEl?: HTMLElement;
  private pos = { top: -9999, left: -9999 };
  private visible = false;
  private raf1: number | null = null;
  private raf2: number | null = null;

  view() {
    const { items } = this.attrs;

    return (
      <span class="Magicbb-MoreWrap" style="display:inline-block">
        <Button
          className="Button Button--icon Button--link"
          icon={this.attrs.icon || 'fas fa-wand-sparkles'}
          onclick={(e: any) => {
            e?.preventDefault?.();
            this.anchor = e.currentTarget as HTMLElement;
            this.toggle();
          }}
          title={this.attrs.label || 'More'}
          aria-expanded={this.open ? 'true' : 'false'}
          aria-haspopup="menu"
        />

        {this.open && (
          <div
            class="Magicbb-MorePopover"
            style={{
              top: `${this.pos.top}px`,
              left: `${this.pos.left}px`,
              visibility: this.visible ? 'visible' : 'hidden',
              willChange: 'top, left',
            }}
            oncreate={(vnode: any) => {
              this.popEl = vnode.dom as HTMLElement;
              this.raf1 = requestAnimationFrame(() => {
                this.positionAbove();
                this.raf2 = requestAnimationFrame(() => {
                  this.positionAbove();
                  this.visible = true;
                  m.redraw();
                });
              });
            }}
            onremove={() => this.cleanup()}
            role="menu"
          >
            <div class="Magicbb-MoreRow">
              {items.map((it) =>
                isSub(it) ? (
                  <span
                    key={it.key}
                    class="Magicbb-MoreBtnIcon"
                    title={it.title}
                    role="menuitem"
                    tabindex="0"
                    aria-label={it.title}
                    aria-haspopup="dialog"
                    aria-expanded="false"
                  >
                    {it.renderSub()}
                  </span>
                ) : (
                  <button
                    key={it.key}
                    class="Magicbb-MoreBtnIcon"
                    role="menuitem"
                    title={it.title}
                    aria-label={it.title}
                    type="button"
                    onclick={(e: any) => {
                      e?.preventDefault?.();
                      const fn = (it as PlainAction).onClick;
                      this.close();
                      requestAnimationFrame(() => fn(e));
                    }}
                  >
                    {it.icon ? <i class={it.icon} aria-hidden="true" /> : <i class="fas fa-circle" style="opacity:.35" aria-hidden="true" />}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </span>
    );
  }

  private toggle() { this.open ? this.close() : this.openPopover(); }

  private openPopover() {
    this.open = true;
    this.visible = false;
    this.pos = { top: -9999, left: -9999 };
    m.redraw();

    window.addEventListener('resize', this.onWin, { passive: true });
    window.addEventListener('scroll', this.onWin, true);

    document.addEventListener('mousedown', this.onDocDownCapture, true);
    document.addEventListener('click', this.onDocClickCapture, true);
    document.addEventListener('keydown', this.onKey);
  }

  private close() {
    this.open = false;
    this.visible = false;
    m.redraw();
    this.cleanup();
  }

  private cleanup() {
    if (this.raf1) cancelAnimationFrame(this.raf1);
    if (this.raf2) cancelAnimationFrame(this.raf2);
    this.raf1 = this.raf2 = null;

    window.removeEventListener('resize', this.onWin);
    window.removeEventListener('scroll', this.onWin, true);

    document.removeEventListener('mousedown', this.onDocDownCapture, true);
    document.removeEventListener('click', this.onDocClickCapture, true);
    document.removeEventListener('keydown', this.onKey);
  }

  private onWin = () => {
    if (!this.open) return;
    this.positionAbove();
    m.redraw();
  };

  private onKey = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') this.close();
  };

  private onDocDownCapture = (ev: MouseEvent) => {
    if (!this.open) return;

    const target = ev.target as Node;
    const moreRoot = this.element as HTMLElement | null;
    const nativePopover = document.querySelector(
      '.Magicbb-ColorPopover, .Magicbb-AlertPopover, .Magicbb-ImagePopover'
    ) as HTMLElement | null;

    const insideMore = !!moreRoot && moreRoot.contains(target);
    const insideNative = !!nativePopover && nativePopover.contains(target);

    if (insideMore || insideNative) return;
    this.close();
  };

  private onDocClickCapture = (ev: MouseEvent) => {
    if (!this.open) return;

    const target = ev.target as Node;
    const nativePopover = document.querySelector(
      '.Magicbb-ColorPopover, .Magicbb-AlertPopover, .Magicbb-ImagePopover'
    ) as HTMLElement | null;

    if (nativePopover && nativePopover.contains(target)) {
      requestAnimationFrame(() => this.close());
    }
  };

  private positionAbove() {
    const ar = this.anchor?.getBoundingClientRect();
    if (!ar) return;

    const rect = this.popEl?.getBoundingClientRect();
    const pw = rect?.width ?? 240;
    const ph = rect?.height ?? 44;

    const vw = document.documentElement.clientWidth || window.innerWidth;
    const isMobile = vw <= 768;

    const leftGutter = 8;
    const rightGutter = 8;

    const reserveRightForInner = isMobile ? 220 : 0;

    let left = Math.round(ar.left);

    const maxLeft = vw - pw - reserveRightForInner - rightGutter;

    if (left > maxLeft) left = Math.max(leftGutter, maxLeft);
    if (left < leftGutter) left = leftGutter;

    let top = Math.round(ar.top - ph - 6);
    if (top < 8) top = 8;

    this.pos.left = left;
    this.pos.top = top;
  }
}