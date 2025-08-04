import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/site.js',
                'resources/sass/fidelis.scss',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
    build: {
        outDir: 'public/build',
        rollupOptions: {
            input: {
                site: 'resources/js/site.js',
                styles: 'resources/sass/fidelis.scss',
            },
        },
    },
}); 