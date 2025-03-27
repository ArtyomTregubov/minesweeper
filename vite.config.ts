import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url' // Современный аналог __dirname

export default defineConfig({
  plugins: [vue()],
  base: '/minesweeper/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Замена __dirname
    }
  }
})