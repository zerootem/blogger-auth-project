import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';
export default defineConfig({
    plugins: [solid()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        target: 'es2020',
        cssCodeSplit: false, // لدمج كل الـ CSS في ملف واحد
        minify: 'terser',
        rollupOptions: {
            output: {
                entryFileNames: 'assets/auth.js',
                chunkFileNames: 'assets/auth-chunk.js',
                assetFileNames: 'assets/auth.[ext]',
            },
        },
    },
});
