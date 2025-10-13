import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';
import MagicBBPage from './components/MagicBBPage';

export default [
  new Extend.Admin().page(MagicBBPage),

  new Extend.Admin().permission(
    () => ({
      icon: 'fas fa-tv',
      label: app.translator.trans('capybash-magicbb.admin.permissions.use_iframe'),
      permission: 'capybash-magicbb.use_iframe',
    }),
    'reply'
  ),
];