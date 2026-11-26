import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// La API (carpeta server) corre en el puerto 3000.
// Con este proxy, las peticiones a /api desde React llegan al servidor.
const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
