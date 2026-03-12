import * as fs from 'fs'

let logStream: fs.WriteStream | null = null

export function closeLogStream() {
  if (logStream && !logStream.writableEnded && !logStream.destroyed) {
    logStream.end()
  }
  logStream = null
}

export function initLogStream(filePath: string) {
  closeLogStream()
  logStream = fs.createWriteStream(filePath, { flags: 'a' })
}

export function log(message: string) {
  const timestamp = new Date().toISOString()
  console.log(message)
  if (logStream && !logStream.writableEnded && !logStream.destroyed) {
    logStream.write(`[${timestamp}] ${message}\n`)
  }
}
