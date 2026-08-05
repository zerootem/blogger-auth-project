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
    cssCodeSplit: true, // للسماح بفصل CSS لكل مدخل
    minify: 'terser',
    rollupOptions: {
      input: {
        auth: path.resolve(import.meta.dirname, 'src/main.tsx'),
        fab: path.resolve(import.meta.dirname, 'src/fab-main.tsx'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name]-chunk.[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
});
