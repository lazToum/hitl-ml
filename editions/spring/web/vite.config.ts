import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to Rust backend in dev
      '/api': { target: 'http://localhost:8080', rewrite: path => path.replace(/^\/api/, '') },
    },
  },
})
