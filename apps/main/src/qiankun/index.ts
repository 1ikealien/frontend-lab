import { registerMicroApps, start } from 'qiankun'
import { microApps } from './apps'

export function setupQiankun(){
  registerMicroApps(microApps)
  start()
}