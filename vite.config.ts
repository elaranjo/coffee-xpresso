import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { DEFAULT_API_BASE_URL } from './src/constants/environment';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
