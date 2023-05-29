import { defineConfig } from 'vite';

const openUrl = 'http://localhost:3000';

export default defineConfig({
  server: {
    port: 5000,
    open: openUrl,
  },
  build: {
    outDir: 'build',
  },
});
