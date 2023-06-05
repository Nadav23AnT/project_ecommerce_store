import { defineConfig } from 'vite';
import { PORT } from './src/Common/CommonConstants';

export default defineConfig({
  root: 'src',
  publicDir: './../public',
  build: {
    outDir: '../build',
    rollupOptions: {
      input: {
        app: './src/Pages/index.html',
      },
    },
  },
  server: {
    port: PORT,
    open: './Pages/index.html',
  },
});
