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

export interface MergeParams {
  hash: string
  filename: string
  size: number
  chunks: {
    index: number
    hash: string
  }[]
}