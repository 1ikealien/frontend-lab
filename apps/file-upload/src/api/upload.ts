import type { FileChunk } from '@/types/file'

export function uploadChunk(chunk: FileChunk): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('上传分片: ',chunk.index)
      const success = Math.random() > 0.8
      if (success) {
        resolve()
      } else {
        reject(new Error(`分片${chunk.index}上传失败`))
      }
      resolve()
    }, 500)
  })
}