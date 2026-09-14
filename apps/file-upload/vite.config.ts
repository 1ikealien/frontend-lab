import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankunPlugin from 'vite-plugin-qiankun'


export default defineConfig({

  plugins: [

    vue(),

    qiankunPlugin(
      'file-upload',
      {
        useDevMode: true,
      }
    ),

  ],

  server: {
    port: 3001,
    cors: true,
  },

  base: './',

})