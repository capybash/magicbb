<?php

namespace Capybash\MagicBB;

use Capybash\MagicBB\Listener\AssertIframePermission;
use Flarum\Extend;
use Flarum\Post\Event\Saving as PostSaving;

return [
    (new Extend\Formatter())->configure(Configure::class),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/resources/less/forum.less')
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/resources/less/admin.less')
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Settings())
        ->default('capybash-magicbb.bb_center', '1')
        ->default('capybash-magicbb.bb_justify', '1')
        ->default('capybash-magicbb.bb_color', '1')
        ->default('capybash-magicbb.bb_spoiler', '1')
        ->default('capybash-magicbb.bb_table', '1')
        ->default('capybash-magicbb.bb_info', '1')
        ->default('capybash-magicbb.bb_image', '1')
        ->default('capybash-magicbb.bb_iframe', '1')
        ->default('capybash-magicbb.toolbar_group', '0')
        ->default('capybash-magicbb.icon_center',  'fas fa-align-center')
        ->default('capybash-magicbb.icon_justify', 'fas fa-align-justify')
        ->default('capybash-magicbb.icon_color',   'fas fa-palette')
        ->default('capybash-magicbb.icon_spoiler', 'fas fa-layer-group')
        ->default('capybash-magicbb.icon_table',   'fas fa-table')
        ->default('capybash-magicbb.icon_info',    'fas fa-info-circle')
        ->default('capybash-magicbb.icon_image',   'fas fa-image')
        ->default('capybash-magicbb.icon_more',    'fas fa-wand-sparkles')
        ->serializeToForum('bb_center',  'capybash-magicbb.bb_center',  'boolval')
        ->serializeToForum('bb_justify', 'capybash-magicbb.bb_justify', 'boolval')
        ->serializeToForum('bb_color',   'capybash-magicbb.bb_color',   'boolval')
        ->serializeToForum('bb_spoiler', 'capybash-magicbb.bb_spoiler', 'boolval')
        ->serializeToForum('bb_table',   'capybash-magicbb.bb_table',   'boolval')
        ->serializeToForum('bb_info',    'capybash-magicbb.bb_info',    'boolval')
        ->serializeToForum('bb_image',   'capybash-magicbb.bb_image',   'boolval')
        ->serializeToForum('bb_iframe',  'capybash-magicbb.bb_iframe',  'boolval')
        ->serializeToForum('bb_toolbar_group', 'capybash-magicbb.toolbar_group', 'boolval')
        ->serializeToForum('icon_center',  'capybash-magicbb.icon_center')
        ->serializeToForum('icon_justify', 'capybash-magicbb.icon_justify')
        ->serializeToForum('icon_color',   'capybash-magicbb.icon_color')
        ->serializeToForum('icon_spoiler', 'capybash-magicbb.icon_spoiler')
        ->serializeToForum('icon_table',   'capybash-magicbb.icon_table')
        ->serializeToForum('icon_info',    'capybash-magicbb.icon_info')
        ->serializeToForum('icon_image',   'capybash-magicbb.icon_image')
        ->serializeToForum('icon_more',    'capybash-magicbb.icon_more'),

    (new Extend\Event())
        ->listen(PostSaving::class, AssertIframePermission::class),
];