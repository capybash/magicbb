import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

export default [
  new Extend.Admin()
    .setting(() => ({
      setting: 'capybash-magicbb.bb_center',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_center'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_center_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_justify',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_justify'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_justify_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_color',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_color'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_color_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_spoiler',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_spoiler'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_spoiler_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_table',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_table'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_table_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_info',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_info'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_info_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_ileft',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_ileft'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_ileft_help'),
    }))
    .setting(() => ({
      setting: 'capybash-magicbb.bb_iright',
      type: 'boolean',
      label: app.translator.trans('capybash-magicbb.admin.settings.bb_iright'),
      help: app.translator.trans('capybash-magicbb.admin.settings.bb_iright_help'),
    })),
];