import type { FileChunk, UploadFile } from '@/types/file'
import { createChunks } from '@/utils/chunk'
import { uploadChunk } from '@/api/upload'
import { retry } from '@/utils/retry'
import { runWithConcurrency } from '@/utils/concurrency'
import { checkFileExists } from '@/api/file'
import { calculateHashWithWorker } from '@/utils/hashWorker'

export class UploadManager {
  async prepareUploadFile(file: File): Promise<UploadFile> {
    const hash = await calculateHashWithWorker(file)
    const exists = await checkFileExists(hash)
    
    if(exists) {
      return {
        file,
        hash,
        status: 'ready',
        progress: 0,
        chunks: [],
        isInstant: true
      }
    }
    const chunks = await createChunks(file)
    return {
      file,
      hash,
      status: 'ready',
      progress: 0,
      chunks
    }
  }

  async uploadChunkWithRetry(chunk: FileChunk): Promise<void> {
    chunk.status = 'uploading'

    try {
      await retry(
        () =>uploadChunk(chunk),
        3
      )

      chunk.status = 'success'
    } catch (error) {
      chunk.status = 'error'
      console.error(error)
      throw error
    }
  }

  async upload(file: UploadFile): Promise<void> {
    file.status = 'uploading'
    const tasks = file.chunks.map((chunk) => {
      return async () => {
        try {
          await this.uploadChunkWithRetry(chunk)
        } finally {
          const successCount = file.chunks.filter(
            (chunk) => chunk.status === 'success'
          ).length
          file.progress = Math.round((successCount / file.chunks.length) * 100)
        }
      }
    })
    try {
      await runWithConcurrency(tasks, 3)
      file.status = 'success'
    } catch (error) {
      file.status = 'error'
      throw error
    }
  }
}
