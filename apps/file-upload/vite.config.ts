import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankunPlugin from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    (qiankunPlugin as any)(
      'file-upload',
      {
        useDevMode: true,
      }
    ),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },

  server: {
    port: 3001,
    cors: true,
  },
  base: './',
})