export function checkFileExists(hash: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingHashes = [
        '88742972d0574bbd1e6b632bf93a8a4ab9f3e076bb77e47cef438087bb3aa63c'
      ]
      resolve(existingHashes.includes(hash))
    }, 300)
  })
}
