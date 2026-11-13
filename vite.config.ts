import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { crx } from '@crxjs/vite-plugin'

const icons = {
  "16": "public/icons/icon16.png",
  "48": "public/icons/icon48.png",
  "128": "public/icons/icon128.png"
}

const crxPlugin = crx({
  manifest: {
    manifest_version: 3,
    name: 'Pushbullet by sarman',
    version: '1.1.2',
    key: 'ehkkonnnnkiodldmojedkjechpoanllb',
    description: 'Extensión creada con Vue 3 y Vite para pushbullet',
    icons: icons,
    action: {
      default_popup: 'index.html#/popup',
      default_icon: icons
    },
    host_permissions: [
      "https://www.pushbullet.com/*"
    ],
    permissions: [
      "tabs",
      "scripting",
      "notifications"
    ]
  }
})
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss(), crxPlugin]
})
