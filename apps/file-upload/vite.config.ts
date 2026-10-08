import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankunPlugin from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

const base = process.env.VITE_PUBLIC_BASE_URL || 'http://localhost:3001/'
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
    origin: 'http://localhost:3001',
  },
  
  base,
})