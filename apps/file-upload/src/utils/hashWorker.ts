/**
 * qiankun 宿主与子应用不同源时，Vite 的 `?worker` 会跨域创建 Worker 被浏览器拦截。
 * 用 Blob URL 在宿主源构造 Worker，单独运行 / 嵌主应用都可用。
 */
const HASH_WORKER_SOURCE = `
self.onmessage = async (event) => {
  const file = event.data
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
  self.postMessage(hash)
}
`

function createHashWorker() {
  const blob = new Blob([HASH_WORKER_SOURCE], {
    type: 'application/javascript',
  })
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)

  const revoke = () => URL.revokeObjectURL(url)
  worker.addEventListener('error', revoke)
  worker.addEventListener('message', revoke, { once: true })

  return worker
}

export function calculateHashWithWorker(
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = createHashWorker()

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
