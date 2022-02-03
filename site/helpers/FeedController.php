<?php

namespace Statamic\SiteHelpers;
use Statamic\API\Entry;

use Statamic\Extend\Controller as AbstractController;

class FeedController extends AbstractController
{
    public function json()
    {
        return [
            'version' => 'https://jsonfeed.org/version/1',
            'title' => 'My Awesome Site',
            'home_page_url' => 'localhost',
            'feed_url' => 'localhost/feed.json',
            'items' => $this->getItems()
        ];
    }

    private function getItems()
    {
        return Entry::whereCollection('dealers')->map(function ($entry) {
            return [
                'id' => $url = $entry->url(),
                'url' => $url,
                'content_html' => markdown($entry->content()),
            ];
        })->all();
    }
}