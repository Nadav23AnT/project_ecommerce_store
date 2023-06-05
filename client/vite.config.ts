import { defineConfig } from 'vite';
import { OPEN_URL, PORT } from './src/Common/CommonConstants';

export default defineConfig({
  server: {
    port: PORT,
    open: OPEN_URL,
  },
  build: {
    outDir: 'build',
  },
});
