import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fluide-logo.png'],
      manifest: {
        name: 'Flunexia',
        short_name: 'Flunexia',
        description: 'Group trip coordination for organizers and suppliers',
        theme_color: '#2D6A4F',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/fluide-logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/fluide-logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
})
