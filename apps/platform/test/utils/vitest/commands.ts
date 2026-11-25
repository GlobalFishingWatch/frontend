import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { BrowserCommand } from 'vitest/node'

export type RecordingIndexEntry = {
  /** The normalized request key the recording answers (see getRecordingKey in mock-network.ts) */
  key: string
  /** Path without extension, relative to apps/platform, as getRecordingPath returns it */
  path: string
}

/**
 * Lists the recordings in `dir` (relative to apps/platform). Runs in Node: the browser can read a
 * file it knows the name of, but cannot list a folder, and the network stub needs the keys of
 * every recording for its near-match fallbacks. Aliases are left out; they point at a recording
 * that is listed itself.
 */
export const listRecordings: BrowserCommand<[dir: string], RecordingIndexEntry[]> = async (
  _context,
  dir
) => {
  const absoluteDir = path.resolve(import.meta.dirname, '../../..', dir)
  const metaFiles = (await readdir(absoluteDir)).filter((file) => file.endsWith('.meta.json'))
  const entries = await Promise.all(
    metaFiles.map(async (file) => {
      const meta = JSON.parse(await readFile(path.join(absoluteDir, file), 'utf-8'))
      if ('aliasOf' in meta) return null
      return { key: meta.key as string, path: `${dir}/${file.slice(0, -'.meta.json'.length)}` }
    })
  )
  return entries.filter((entry): entry is RecordingIndexEntry => entry !== null)
}
