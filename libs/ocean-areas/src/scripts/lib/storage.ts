import { spawn } from 'child_process'
import fs from 'fs/promises'

import 'dotenv/config'

const bucketId = process.env.GOOGLE_BUCKET_ID
if (!bucketId) {
  throw new Error('GOOGLE_BUCKET_ID is not set')
}

export async function downloadFolder(gsPath: string, localPath: string) {
  try {
    await fs.access(localPath)
  } catch {
    await fs.mkdir(localPath, { recursive: true })
  }
  try {
    const script = `gsutil -m cp -r "gs://${bucketId}/${gsPath}" "${localPath}"`
    console.log(`Executing ${script}`)

    return new Promise<void>((resolve, reject) => {
      const child = spawn(script, {
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true,
      })

      // Stream stdout in real-time - preserve formatting
      child.stdout?.on('data', (data) => {
        process.stdout.write(data)
      })

      // Stream stderr in real-time - preserve formatting
      child.stderr?.on('data', (data) => {
        process.stderr.write(data)
      })

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Download completed successfully in ${localPath}`)
          resolve()
        } else {
          console.error(`❌ Process exited with code ${code}`)
          reject(new Error(`Process exited with code ${code}`))
        }
      })

      child.on('error', (error) => {
        console.error(`❌ Error executing script:`, error)
        reject(error)
      })
    })
  } catch (error) {
    console.error(`❌ Error downloading file`, error)
    throw error
  }
}
