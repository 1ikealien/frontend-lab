import { registerMicroApps, start } from 'qiankun'
import { microApps } from './apps'

export function setupQiankun() {
  registerMicroApps(microApps)

  // 开发时未启动的子应用会被 prefetch 成 Failed to fetch，先关掉
  start({
    prefetch: false,
    singular: true,
  })
}
