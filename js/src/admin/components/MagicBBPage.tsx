import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import type m from 'mithril';

function Section(iconClass: string, titleKey: string, ...children: m.Children[]) {
  return (
    <section className="MagicBB-SettingsSection">
      <h3>
        <i className={iconClass} aria-hidden="true" />
        {app.translator.trans(titleKey)}
      </h3>
      <div className="MagicBB-SettingsSection-content">{children}</div>
    </section>
  );
}

export default class MagicBBPage extends ExtensionPage {
  content() {
    return (
      <div className="MagicBBPage">
        <div className="MagicBBPage-content">
          {Section(
            'fas fa-highlighter',
            'capybash-magicbb.admin.sections.text',
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_center',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_center'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_center',
                placeholder: 'fas fa-align-center',
                style: { maxWidth: '22rem' },
              })}
            </div>,
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_justify',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_justify'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_justify',
                placeholder: 'fas fa-align-justify',
                style: { maxWidth: '22rem' },
              })}
            </div>,
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_color',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_color'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_color',
                placeholder: 'fas fa-palette',
                style: { maxWidth: '22rem' },
              })}
            </div>
          )}

          {Section(
            'fas fa-table',
            'capybash-magicbb.admin.sections.content',
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_spoiler',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_spoiler'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_spoiler',
                placeholder: 'fas fa-layer-group',
                style: { maxWidth: '22rem' },
              })}
            </div>,
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_info',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_info'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_info',
                placeholder: 'fas fa-info-circle',
                style: { maxWidth: '22rem' },
              })}
            </div>,
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_table',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_table'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_table',
                placeholder: 'fas fa-table',
                style: { maxWidth: '22rem' },
              })}
            </div>
          )}

          {Section(
            'fas fa-image',
            'capybash-magicbb.admin.sections.images',
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_image',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_image'),
                help: app.translator.trans('capybash-magicbb.admin.settings.bb_image_help'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_image',
                placeholder: 'fas fa-image',
                style: { maxWidth: '22rem' },
              })}
            </div>
          )}

          {Section(
            'fas fa-tv',
            'capybash-magicbb.admin.sections.features',
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.bb_iframe',
                label: app.translator.trans('capybash-magicbb.admin.settings.bb_iframe'),
                help: app.translator.trans('capybash-magicbb.admin.settings.bb_iframe_help'),
              })}
            </div>,
            <div className="Form-group">
              {this.buildSettingComponent({
                type: 'boolean',
                setting: 'capybash-magicbb.toolbar_group',
                label: app.translator.trans('capybash-magicbb.admin.settings.toolbar_group'),
                help: app.translator.trans('capybash-magicbb.admin.settings.toolbar_group_help'),
              })}
              {this.buildSettingComponent({
                type: 'text',
                setting: 'capybash-magicbb.icon_more',
                placeholder: 'fas fa-wand-sparkles',
                style: { maxWidth: '22rem' },
              })}
            </div>
          )}

          <div className="Form-group">{this.submitButton()}</div>
        </div>
      </div>
    );
  }
}