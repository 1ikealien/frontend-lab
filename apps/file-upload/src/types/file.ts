export interface UploadFile {
  file: File
  hash: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  progress: number
  chunks: FileChunk[]
  isInstant?: boolean
}

export interface FileChunk {
  index: number
  chunk: Blob
  start: number
  end: number
  hash: string
  status: 'pending' | 'uploading' | 'success' | 'error'
}