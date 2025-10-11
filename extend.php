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
        ->serializeToForum('bb_center',  'capybash-magicbb.bb_center',  'boolval')
        ->serializeToForum('bb_justify', 'capybash-magicbb.bb_justify', 'boolval')
        ->serializeToForum('bb_color',   'capybash-magicbb.bb_color',   'boolval')
        ->serializeToForum('bb_spoiler', 'capybash-magicbb.bb_spoiler', 'boolval')
        ->serializeToForum('bb_table',   'capybash-magicbb.bb_table',   'boolval')
        ->serializeToForum('bb_info',    'capybash-magicbb.bb_info',    'boolval')
        ->serializeToForum('bb_image',   'capybash-magicbb.bb_image',   'boolval')
        ->serializeToForum('bb_iframe',  'capybash-magicbb.bb_iframe',  'boolval'),

    (new Extend\Event())
        ->listen(PostSaving::class, AssertIframePermission::class),
];