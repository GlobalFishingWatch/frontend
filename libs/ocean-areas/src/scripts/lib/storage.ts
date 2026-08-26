import { spawn } from 'child_process'
import fs from 'fs/promises'

import 'dotenv/config'

/**
 * Resolved on use, not at import: `screenshots.ts` imports this module for `uploadFolder` but only
 * needs a bucket when `--upload` is passed, and throwing at import time would break every run.
 */
export function resolveGsUri(path: string) {
  if (path.startsWith('gs://')) {
    return path
  }
  const bucketId = process.env.GOOGLE_BUCKET_ID
  if (!bucketId) {
    throw new Error(`GOOGLE_BUCKET_ID is not set, so "${path}" cannot be resolved to a bucket`)
  }
  return `gs://${bucketId}/${path}`
}

function runGsutil(args: string[], successMessage: string) {
  console.log(`Executing gsutil ${args.join(' ')}`)
  return new Promise<void>((resolve, reject) => {
    const child = spawn('gsutil', args, { stdio: ['inherit', 'pipe', 'pipe'] })

    // Stream stdout/stderr in real-time - preserve formatting
    child.stdout?.on('data', (data) => process.stdout.write(data))
    child.stderr?.on('data', (data) => process.stderr.write(data))

    child.on('error', (error) => {
      console.error(`❌ Error executing gsutil:`, error)
      reject(
        new Error(
          `Could not run gsutil (${error.message}). Install the gcloud SDK and run \`gcloud auth login\`.`
        )
      )
    })
    child.on('close', (code) => {
      if (code === 0) {
        console.log(successMessage)
        resolve()
      } else {
        console.error(`❌ Process exited with code ${code}`)
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

/** `gsPath` is relative to `GOOGLE_BUCKET_ID`, or a full `gs://` URI. */
export async function downloadFolder(gsPath: string, localPath: string) {
  try {
    await fs.access(localPath)
  } catch {
    await fs.mkdir(localPath, { recursive: true })
  }
  return runGsutil(
    ['-m', 'cp', '-r', resolveGsUri(gsPath), localPath],
    `✅ Download completed successfully in ${localPath}`
  )
}

/**
 * Mirrors a local folder into the bucket. rsync rather than cp so a re-run only ships what changed
 * and the bucket layout ends up identical to the local one. `gsPath` is relative to
 * `GOOGLE_BUCKET_ID`, or a full `gs://` URI.
 */
export async function uploadFolder(localPath: string, gsPath: string) {
  const destination = resolveGsUri(gsPath)
  return runGsutil(
    ['-m', 'rsync', '-r', localPath, destination],
    `✅ Upload completed successfully in ${destination}`
  )
}
