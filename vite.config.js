import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Permite cualquier host (ngrok, cloudflared, IP local, etc.)
    // sin tener que cambiar este archivo cada vez
    allowedHosts: 'all'
  }
})