import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router/index.ts'

import './styles/index.scss'

import { setupQiankun } from './qiankun'

const app = createApp(App)

const pinia = createPinia()

app.use(router)

app.use(pinia)

setupQiankun()

app.mount('#app')