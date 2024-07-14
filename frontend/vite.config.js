// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://anirudh-e-store.onrender.com',
        changeOrigin: true,
        secure: false, // if the backend uses https and has a self-signed certificate
      },
    },
  },
});
