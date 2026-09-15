export function mergeFile(
  hash: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        '合并文件: ',
        hash
      )
      resolve()
    }, 500)
  })
}
