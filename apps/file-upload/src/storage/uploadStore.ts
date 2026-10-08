export interface UploadRecord {
  hash: string
  filename: string
  size: number
  chunks: {
    index: number
    hash: string
    status: 'pending' | 'success'
  }[]
  updatedAt: number
}

const DB_NAME = 'frontend-lab-upload'
const STORE_NAME = 'uploads'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    )

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(
          STORE_NAME,
          {
            keyPath: 'hash'
          }
        )
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export function saveUploadRecord(
  record: UploadRecord
): Promise<void> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readwrite'
      )

      const store = transaction.objectStore(
        STORE_NAME
      )

      const request = store.put(record)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  })
}

export function getUploadRecord(
  hash: string
): Promise<UploadRecord | undefined> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readonly'
      )

      const store = transaction.objectStore(
        STORE_NAME
      )

      const request = store.get(hash)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  })
}

export function removeUploadRecord(
  hash: string
): Promise<void> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        STORE_NAME,
        'readwrite'
      )

      const store = transaction.objectStore(
        STORE_NAME
      )

      const request = store.delete(hash)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  })
}
