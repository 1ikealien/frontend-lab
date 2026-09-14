import type { RegistrableApp } from 'qiankun'

export const microApps: RegistrableApp<any>[] =[
  {
    name: 'file-upload',
    entry: 'http://localhost:3001',
    container: '#subapp-container',
    activeRule: '/lab/upload',
  },
]