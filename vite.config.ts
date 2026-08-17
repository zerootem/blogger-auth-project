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
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name]-chunk.[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});
