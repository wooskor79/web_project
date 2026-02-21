import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/phpmyadmin': {
        target: 'http://phpmyadmin:80',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/phpmyadmin/, '')
      }
    }
  }
})
