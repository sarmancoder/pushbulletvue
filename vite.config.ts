import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { crx } from '@crxjs/vite-plugin'

const crxPlugin = crx({
  manifest: {
    manifest_version: 3,
    name: 'Pushbullet by sarman',
    version: '1.0.0',
    description: 'Extensión creada con Vue 3 y Vite para pushbullet',
    action: {
      default_popup: 'index.html',
      default_icon: 'icons/icon128.png' // Opcional: ruta dentro de tu carpeta public/
    },
    permissions: [
      'storage',
      'tabs'
    ]
  }
})

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss(), crxPlugin],
})
