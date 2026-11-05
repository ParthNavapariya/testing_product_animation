import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  css: {
    postcss: {}
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext'
  }
});
