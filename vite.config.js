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
        cssCodeSplit: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                entryFileNames: 'assets/auth.[hash].js',
                chunkFileNames: 'assets/auth-chunk.[hash].js',
                assetFileNames: 'assets/auth.[hash][extname]',
            },
        },
    },
});
