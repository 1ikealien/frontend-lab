import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

import { render } from './main-app'

let app: any

renderWithQiankun({
  bootstrap() {
    console.log('form-builder bootstrap')
  },
  mount(props) {
    console.log('form-builder mount', props)

    app = render(
      props.container?.querySelector('#app') || props.container
    )
  },
  
  update() {
    console.log('form-builder update')
  },

  unmount() {
    console.log('form-builder unmount')
    app?.unmount()
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}