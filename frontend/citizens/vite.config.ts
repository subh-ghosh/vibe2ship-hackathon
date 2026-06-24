import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vibe2Ship Maps',
        short_name: 'Maps',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://maps.gstatic.com/mapfiles/maps_lite/pwa/icons/maps15_bnuw3a_round_192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://maps.gstatic.com/mapfiles/maps_lite/pwa/icons/maps15_bnuw3a_round_192x192.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
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
