<?php

declare(strict_types=1);

namespace Capybash\MagicBB\Listener;

use Flarum\Post\Event\Saving;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;

final class AssertIframePermission
{
    public function __construct(private SettingsRepositoryInterface $settings) {}

    public function handle(Saving $event): void
    {
        if ($this->settings->get('capybash-magicbb.bb_iframe') !== '1') {
            return;
        }

        $content = (string) ($event->data['attributes']['content'] ?? '');
        if ($content === '') {
            return;
        }

        if (!preg_match('/<\s*iframe\b/i', $content) && !preg_match('/\[\s*iframe\b/i', $content)) {
            return;
        }

        if (!$event->actor->hasPermission('capybash-magicbb.use_iframe')) {
            throw new PermissionDeniedException();
        }
    }
}