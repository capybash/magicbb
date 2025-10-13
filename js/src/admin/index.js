import app from 'flarum/admin/app';
import MagicBBPage from './components/MagicBBPage';

app.initializers.add('capybash-magicbb', () => {
  app.extensionData
    .for('capybash-magicbb')
    .registerPage(MagicBBPage)
    .registerPermission(
      {
        icon: 'fas fa-tv',
        label: app.translator.trans('capybash-magicbb.admin.permissions.use_iframe'),
        permission: 'capybash-magicbb.use_iframe',
      },
      'reply'
    );
});