import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.tmx', '**/*.tsx'],
  build: {
    minify: false, // 👈 disables variable mangling
    sourcemap: true, // 👈 helps trace the error
  },
})