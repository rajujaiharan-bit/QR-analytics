import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true, // Allow all tunnel domains (localtunnel, serveo, custom hosts)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/r': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});