export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]>{
  const results: T[] = []
  let index = 0
  async function worker() {
    while (index < tasks.length) {
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

// async function test() {
//   const tasks = Array.from(
//     { length: 5 },
//     (_, index) => async () => {
//       console.log('开始任务', index)
//       await new Promise((resolve) => {
//         setTimeout(resolve, 1000)
//       })
//       console.log('完成任务', index)
//       return index
//     }
//   )
//   const result = await runWithConcurrency(tasks, 2)
//   console.log('结果', result)
// }
// test()