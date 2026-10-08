import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from '@/router/index.ts'

import './styles/index.scss'

import { setupQiankun } from './qiankun'

const app = createApp(App)

const pinia = createPinia()

app.use(router)

app.use(pinia)

app.use(ElementPlus)

app.mount('#app')

// 等主应用 DOM（含 #subapp-container）就绪后再启动 qiankun
setupQiankun()