import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';

const section = (titleKey, helpKey, iconClass) => (
  <div class="Form-group MagicBB-section">
    <label class="FormControl-label MagicBB-sectionTitle">
      <i class={`icon ${iconClass}`}></i>
      {app.translator.trans(titleKey)}
    </label>
    <p class="helpText">{app.translator.trans(helpKey)}</p>
  </div>
);

export default class MagicBBPage extends ExtensionPage {
  content() {
    return (
      <div class="Form MagicBBPage">
        {section(
          'capybash-magicbb.admin.sections.text',
          'capybash-magicbb.admin.sections.text_help',
          'fas fa-align-left'
        )}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_center',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_center'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_center_help'),
        })}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_justify',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_justify'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_justify_help'),
        })}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_color',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_color'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_color_help'),
        })}

        {section(
          'capybash-magicbb.admin.sections.content',
          'capybash-magicbb.admin.sections.content_help',
          'fas fa-puzzle-piece'
        )}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_spoiler',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_spoiler'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_spoiler_help'),
        })}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_info',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_info'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_info_help'),
        })}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_table',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_table'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_table_help'),
        })}

        {section(
          'capybash-magicbb.admin.sections.images',
          'capybash-magicbb.admin.sections.images_help',
          'fas fa-image'
        )}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_ileft',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_ileft'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_ileft_help'),
        })}
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'capybash-magicbb.bb_iright',
          label: app.translator.trans('capybash-magicbb.admin.settings.bb_iright'),
          help: app.translator.trans('capybash-magicbb.admin.settings.bb_iright_help'),
        })}

        <div class="Form-group">
          {Button.component(
            {
              className: 'Button Button--primary',
              onclick: (e) => this.saveSettings(e),
              loading: this.loading,
            },
            app.translator.trans('core.admin.settings.submit_button')
          )}
        </div>
      </div>
    );
  }
}