import Extend from 'flarum/common/extenders';
import MagicBBPage from './components/MagicBBPage';

export default [
  new Extend.Admin().page(MagicBBPage),
];