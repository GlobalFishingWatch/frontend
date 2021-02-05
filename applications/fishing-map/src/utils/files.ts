export const blobToText = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string)
      } else {
        reject('no reader result')
      }
    }
    reader.readAsText(blob)
  })
}

export const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as ArrayBuffer)
      } else {
        reject('no reader result')
      }
    }
    reader.readAsArrayBuffer(blob)
  })
}
