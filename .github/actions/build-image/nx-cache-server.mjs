// Nx self-hosted remote cache (https://nx.dev/docs/guides/tasks--caching/self-hosted-caching)
// served from a local directory that the job restores from and saves to the GitHub Actions cache.
//
// Nx rejects artifacts copied straight into its local cache directory ("Unrecognized Cache
// Artifacts"), so a restored cache dir is useless on a fresh runner. Artifacts that come through
// the remote-cache protocol are accepted.
//
// Env: NX_CACHE_SERVER_DIR, NX_CACHE_SERVER_PORT, NX_CACHE_SERVER_TOKEN,
//      NX_CACHE_SERVER_READ_ONLY=true to answer every upload with 403.
// Every artifact read or written gets its mtime bumped, so the job can delete the ones this run
// did not use before saving the directory.
import console from 'node:console'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rename, rm, stat, utimes } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join } from 'node:path'
import process from 'node:process'
import { pipeline } from 'node:stream/promises'

const dir = process.env.NX_CACHE_SERVER_DIR
const port = Number(process.env.NX_CACHE_SERVER_PORT)
const token = process.env.NX_CACHE_SERVER_TOKEN
const readOnly = process.env.NX_CACHE_SERVER_READ_ONLY === 'true'
if (!dir || !port || !token) {
  console.error('NX_CACHE_SERVER_DIR, NX_CACHE_SERVER_PORT and NX_CACHE_SERVER_TOKEN are required')
  process.exit(1)
}
await mkdir(dir, { recursive: true })

const HASH = /^\/v1\/cache\/([A-Za-z0-9_-]{1,128})$/
const stats = { hit: 0, miss: 0, stored: 0, denied: 0 }

const touch = (file) => {
  const now = new Date()
  return utimes(file, now, now)
}

const server = createServer(async (req, res) => {
  const hash = HASH.exec(req.url ?? '')?.[1]
  if (!hash) return res.writeHead(404).end()
  if (req.headers.authorization !== `Bearer ${token}`) return res.writeHead(401).end()
  const file = join(dir, hash)

  try {
    if (req.method === 'GET') {
      const info = await stat(file).catch(() => null)
      if (!info) {
        stats.miss++
        return res.writeHead(404).end()
      }
      await touch(file)
      stats.hit++
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': info.size,
      })
      return await pipeline(createReadStream(file), res)
    }

    if (req.method === 'PUT') {
      if (readOnly) {
        stats.denied++
        req.resume()
        return res.writeHead(403).end()
      }
      if (await stat(file).catch(() => null)) {
        await touch(file)
        req.resume()
        return res.writeHead(409).end()
      }
      const tmp = `${file}.${process.pid}.tmp`
      try {
        await pipeline(req, createWriteStream(tmp))
        await rename(tmp, file)
      } catch (error) {
        await rm(tmp, { force: true })
        throw error
      }
      stats.stored++
      return res.writeHead(202).end()
    }

    res.writeHead(405).end()
  } catch (error) {
    console.error(`${req.method} ${hash}:`, error)
    if (!res.headersSent) res.writeHead(500)
    res.end()
  }
})

const stop = () => {
  console.log(`nx cache server: ${JSON.stringify(stats)}`)
  server.close(() => process.exit(0))
}
process.on('SIGTERM', stop)
process.on('SIGINT', stop)

server.listen(port, '127.0.0.1', () => {
  console.log(`nx cache server on 127.0.0.1:${port} (${readOnly ? 'read-only' : 'read-write'})`)
})
