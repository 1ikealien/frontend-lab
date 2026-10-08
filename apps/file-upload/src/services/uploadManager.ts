import type { FileChunk, UploadFile } from '@/types/file'
import { createChunks } from '@/utils/chunk'
import { uploadChunk } from '@/api/upload'
import { retry } from '@/utils/retry'
import { runWithConcurrency } from '@/utils/concurrency'
import { checkFileExists } from '@/api/file'
import { calculateHashWithWorker } from '@/utils/hashWorker'
import { mergeFile } from '@/api/merge'
import { getUploadRecord, saveUploadRecord } from '@/storage/uploadStore'

export class UploadManager {
  async prepareUploadFile(file: File): Promise<UploadFile> {
    const hash = await calculateHashWithWorker(file)
    const record = await getUploadRecord(hash)
    const exists = await checkFileExists(hash)
    
    if(exists) {
      return {
        file,
        hash,
        status: 'ready',
        progress: 0,
        chunks: [],
        paused: false,
        isInstant: true
      }
    }
    const chunks = await createChunks(file)
    
    if (record) {
      record.chunks.forEach((recordChunk) => {
        const chunk = chunks.find(
          (chunk) => chunk.index === recordChunk.index
        )

        if (chunk && recordChunk.status === 'success') {
          chunk.status = 'success'
        }
      })
    }

    const successCount = chunks.filter(
      (chunk) => chunk.status === 'success'
    ).length

    const progress = Math.round(
      (successCount / chunks.length) * 100
    )

    return {
      file,
      hash,
      status: 'ready',
      progress,
      chunks,
      paused: false
    }
  }

  async uploadChunkWithRetry(file: UploadFile, chunk: FileChunk): Promise<void> {
    chunk.status = 'uploading'

    try {
      await retry(
        () =>uploadChunk(chunk),
        3
      )

      chunk.status = 'success'

      await this.updateRecord(file)
    } catch (error) {
      chunk.status = 'error'
      console.error(error)
      throw error
    }
  }

  async upload(file: UploadFile): Promise<void> {
    file.status = 'uploading'
    const tasks = file.chunks.filter((chunk) => chunk.status !== 'success').map((chunk) => {
      return async () => {
        try {
          await this.uploadChunkWithRetry(file, chunk)
        } finally {
          const successCount = file.chunks.filter(
            (chunk) => chunk.status === 'success'
          ).length
          file.progress = Math.round((successCount / file.chunks.length) * 100)
        }
      }
    })
    try {
      await runWithConcurrency(tasks, 3, () => !file.paused)

      if (file.paused) {
        return
      }
      const successCount = file.chunks.filter(
        (chunk) => chunk.status === 'success'
      ).length

      file.progress = Math.round(
        (successCount / file.chunks.length) * 100
      )

      await mergeFile({
        hash: file.hash,
        filename: file.file.name,
        size: file.file.size,
        chunks: file.chunks.map(chunk => ({
          index: chunk.index,
          hash: chunk.hash
        }))
      })
      file.status = 'success'

      await this.updateRecord(file)
    } catch (error) {
      file.status = 'error'
      throw error
    }
  }

  private async updateRecord(file: UploadFile): Promise<void> {
    await saveUploadRecord({
      hash: file.hash,
      filename: file.file.name,
      size: file.file.size,

      chunks: file.chunks.map(chunk => ({
        index: chunk.index,
        hash: chunk.hash,
        status:
        chunk.status === 'success' ? 'success' : 'pending'
      })),
      updatedAt: Date.now()
    })
  }
}
