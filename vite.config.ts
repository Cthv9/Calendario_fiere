import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// For GitHub Pages set VITE_BASE to "/<repo-name>/" (workflow already does it)
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Schema Ferie',
        short_name: 'Ferie',
        description: 'Schema ferie/ROL con eventi (fiere, inventari, chiusure) e contatori dinamici.',
        theme_color: '#0f172a',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: { navigateFallback: base + 'index.html' },
    }),
  ],
})
