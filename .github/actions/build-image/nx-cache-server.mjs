import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  utimesSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { argv } from 'node:process'

const dir = argv[2]
mkdirSync(dir, { recursive: true })

createServer((req, res) => {
  const hash = /^\/v1\/cache\/(\w+)$/.exec(req.url)?.[1]
  if (!hash) return res.writeHead(404).end()
  const file = join(dir, hash)

  if (req.method === 'GET') {
    if (!existsSync(file)) return res.writeHead(404).end()
    utimesSync(file, new Date(), new Date())
    return createReadStream(file).pipe(res)
  }

  if (existsSync(file)) return res.writeHead(409).end()
  req.pipe(createWriteStream(`${file}.tmp`)).on('finish', () => {
    renameSync(`${file}.tmp`, file)
    res.writeHead(202).end()
  })
}).listen(4911)
