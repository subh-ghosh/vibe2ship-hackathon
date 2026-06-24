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
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
              return 'react-vendor';
            }
            if (id.includes('/node_modules/maplibre-gl/') || id.includes('/node_modules/react-map-gl/')) {
              return 'map-vendor';
            }
            if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/lucide-react/') || id.includes('/node_modules/zustand/')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
