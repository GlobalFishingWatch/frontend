import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  utimesSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { argv } from 'node:process'
import { pipeline } from 'node:stream'

const dir = argv[2]
mkdirSync(dir, { recursive: true })

const fail = (res) => {
  if (!res.headersSent) res.writeHead(500)
  res.end()
}

createServer((req, res) => {
  const hash = /^\/v1\/cache\/(\w+)$/.exec(req.url)?.[1]
  if (!hash) return res.writeHead(404).end()
  const file = join(dir, hash)

  if (req.method === 'GET') {
    if (!existsSync(file)) return res.writeHead(404).end()
    // The pre-save prune drops every entry older than the build's start marker
    utimesSync(file, new Date(), new Date())
    return pipeline(createReadStream(file), res, (err) => err && fail(res))
  }

  if (existsSync(file)) return res.writeHead(409).end()
  const tmp = `${file}.tmp`
  pipeline(req, createWriteStream(tmp), (err) => {
    if (err) {
      rmSync(tmp, { force: true })
      return fail(res)
    }
    renameSync(tmp, file)
    res.writeHead(202).end()
  })
}).listen(4911, '127.0.0.1')
