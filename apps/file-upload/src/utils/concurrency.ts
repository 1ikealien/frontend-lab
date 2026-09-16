export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
  canContinue: () => boolean
): Promise<T[]>{
  const results: T[] = []
  let index = 0
  async function worker() {
    while (index < tasks.length) {
      if (!canContinue()) {
        return
      }
      const currentIndex = index
      index++
      const result = await tasks[currentIndex]()
      results[currentIndex] = result
    }
  }

  const workers = Array.from(
    { length: limit },
    () =>worker()
  )
  await Promise.all(workers)
  return results
}
