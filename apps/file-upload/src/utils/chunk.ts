import type { FileChunk } from '@/types/file'
import { calculateHash } from '@/utils/hash'

export async function createChunks(
  file: File,
  chunkSize = 2 * 1024 * 1024
): Promise<FileChunk[]> {
  const chunks: FileChunk[] = []
  let index = 0

  for(let start = 0; start < file.size; start += chunkSize) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    const hash = await calculateHash(chunk)

    chunks.push({index, chunk, start, end, hash, status: 'pending'})
    index++
  }
  return chunks
}
