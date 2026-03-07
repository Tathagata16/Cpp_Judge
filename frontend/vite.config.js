import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // ── CHANGE THIS if your backend runs on a different port ──
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
