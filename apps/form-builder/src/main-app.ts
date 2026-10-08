import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import './style.css'

export function render(container?: HTMLElement) {
  const app = createApp(App)

  app.use(ElementPlus)

  app.mount(container || '#app')

  return app
}