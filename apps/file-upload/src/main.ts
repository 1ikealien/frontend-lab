import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

import { render } from './main-app'


let app:any


renderWithQiankun({

  bootstrap() {
    console.log('file-upload bootstrap')
  },


  mount(props) {

    console.log(
      'file-upload mount',
      props
    )

    app = render(
      props.container?.querySelector('#app') || props.container
    )

  },


  update() {

    console.log(
      'file-upload update'
    )

  },


  unmount() {

    console.log(
      'file-upload unmount'
    )

    app?.unmount()

  }

})


if (!qiankunWindow.__POWERED_BY_QIANKUN__) {

  render()

}