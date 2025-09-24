<?php

namespace Capybash\MagicBB;

use Flarum\Extend;

return [
    (new Extend\Formatter())->configure(Configure::class),
    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/resources/less/forum.less')
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    (new Extend\Settings())
        ->default('capybash-magicbb.bb_center',  '1')
        ->default('capybash-magicbb.bb_justify', '1')
        ->default('capybash-magicbb.bb_color',   '1')
        ->default('capybash-magicbb.bb_spoiler', '1')
        ->default('capybash-magicbb.bb_table',   '1')
        ->default('capybash-magicbb.bb_info',    '1')
        ->default('capybash-magicbb.bb_ileft',   '1')
        ->default('capybash-magicbb.bb_iright',  '1')

        ->serializeToForum('bb_center',  'capybash-magicbb.bb_center',  'boolval')
        ->serializeToForum('bb_justify', 'capybash-magicbb.bb_justify', 'boolval')
        ->serializeToForum('bb_color',   'capybash-magicbb.bb_color',   'boolval')
        ->serializeToForum('bb_spoiler', 'capybash-magicbb.bb_spoiler', 'boolval')
        ->serializeToForum('bb_table',   'capybash-magicbb.bb_table',   'boolval')
        ->serializeToForum('bb_info',    'capybash-magicbb.bb_info',    'boolval')
        ->serializeToForum('bb_ileft',   'capybash-magicbb.bb_ileft',   'boolval')
        ->serializeToForum('bb_iright',  'capybash-magicbb.bb_iright',  'boolval'),
];