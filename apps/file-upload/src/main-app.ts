import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

export function render(container?: HTMLElement){
  const app = createApp(App)

  app.mount(
    container || '#app'
  )

  return app
}
