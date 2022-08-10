export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): Promise<string>
export function readBlobAs(blob: Blob, format: 'text' | 'arrayBuffer'): any {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        if (format === 'text') {
          resolve(reader.result as string)
        } else {
          resolve(reader.result as ArrayBuffer)
        }
      } else {
        reject('no reader result')
      }
    }
    if (format === 'text') {
      reader.readAsText(blob)
    } else {
      reader.readAsArrayBuffer(blob)
    }
  })
}
