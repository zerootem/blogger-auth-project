import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import vue from '@vitejs/plugin-vue';
import path from 'path';
export default defineConfig({
    plugins: [
        vue(),
        solid(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        minify: 'terser',
        rollupOptions: {
            input: {
                auth: path.resolve(import.meta.dirname, 'src/main.tsx'),
                fab: path.resolve(import.meta.dirname, 'src/fab-main.tsx'),
                toast: path.resolve(import.meta.dirname, 'src/toast-main.ts'),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    const mod = chunkInfo.facadeModuleId || '';
                    if (mod.includes('/src/main.tsx'))
                        return 'assets/auth.js';
                    if (mod.includes('/src/fab-main.tsx'))
                        return 'assets/fab.js';
                    if (mod.includes('/src/toast-main.ts'))
                        return 'assets/toast.js';
                    return 'assets/[name].[hash].js';
                },
                chunkFileNames: 'assets/[name]-chunk.[hash].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name === 'auth.css')
                        return 'assets/auth.css';
                    if (name === 'toast.css')
                        return 'assets/toast.css';
                    if (name === 'fab.css')
                        return 'assets/fab.css';
                    return 'assets/[name].[hash][extname]';
                },
            },
        },
    },
});
