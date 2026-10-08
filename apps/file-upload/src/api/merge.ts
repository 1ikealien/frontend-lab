import type { MergeParams } from '@/types/file'

export function mergeFile(
  params: MergeParams
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        '合并文件: ',
        params
      )
      resolve()
    }, 500)
  })
}
