import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Port par défaut Vite : 5173
    // Pour changer : VITE_PORT=4000 npm run dev
    port: parseInt(process.env.VITE_PORT) || 5173,
    host: true, // accessible depuis WSL sur le réseau local
  },
  build: { outDir: 'dist' }
})
