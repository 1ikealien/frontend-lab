export async function calculateHash(file: Blob) {
  const buffer = await file.arrayBuffer()

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    buffer
  )

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  )

  const hash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

  return hash
}