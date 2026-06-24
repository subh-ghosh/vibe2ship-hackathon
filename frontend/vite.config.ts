import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('maplibre-gl') || id.includes('react-map-gl')) {
              return 'map-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('zustand')) {
              return 'ui-vendor';
            }
            return 'vendor'; // all other dependencies
          }
        }
      }
    }
  }
})
