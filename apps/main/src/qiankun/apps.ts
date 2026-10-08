import type { RegistrableApp } from 'qiankun'

const fileUploadEntry = import.meta.env.VITE_FILE_UPLOAD_URL || 'http://localhost:3001'
const formBuilderEntry = import.meta.env.VITE_FORM_BUILDER_URL || 'http://localhost:3002'

export const microApps: RegistrableApp<any>[] = [
  {
    name: 'file-upload',
    entry: fileUploadEntry,
    container: '#subapp-container',
    activeRule: '/lab/upload',
  },
  {
    name: 'form-builder',
    entry: formBuilderEntry,
    container: '#subapp-container',
    activeRule: '/lab/form',
  }
]
