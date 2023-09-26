import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from "path";
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx','resources/js/Pages/Index.tsx',],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js/"),
        },
    },
});
