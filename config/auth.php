<?php

return [

    'guards' => [
        'api' => [
            'driver' => 'token',
            'provider' => 'users',
            'hash' => false,
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'statamic',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'resets' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],

        'activations' => [
            'provider' => 'users',
            'table' => 'password_activations',
            'expire' => 4320,
            'throttle' => 60,
        ],
    ],

];
