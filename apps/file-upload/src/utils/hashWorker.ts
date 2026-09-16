import HashWorker from '@/workers/hash.worker?worker'

export function calculateHashWithWorker(
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new HashWorker()

    worker.onmessage = (event) => {
      resolve(event.data)
      worker.terminate()
    }

    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }

    worker.postMessage(file)
  })
}
