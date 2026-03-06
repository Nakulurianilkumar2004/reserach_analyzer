import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // optional: change dev server port if needed
    open: true,       // automatically opens browser
  },
  css: {
    postcss: './postcss.config.js', // ensures Vite uses Tailwind's PostCSS config
  },
});