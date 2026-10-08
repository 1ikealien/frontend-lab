export async function retry<T>(
  fn: () => Promise<T>,
  times = 3
): Promise<T> {
  let lastError: unknown
  for(let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.log(
        `第 ${i + 1} 次失败`
      )
    }
  }
  throw lastError
}