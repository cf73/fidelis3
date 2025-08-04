<?php

return [

    'cloud' => env('FILESYSTEM_CLOUD', 's3'),

    'disks' => [
        'assets' => [
            'driver' => 'local',
            'root' => public_path('assets'),
            'url' => '/assets',
            'visibility' => 'public',
        ],

        'assets_main' => [
            'driver' => 'local',
            'root' => base_path('assets'),
            'url' => '/assets',
            'visibility' => 'public',
        ],
    ],

];
