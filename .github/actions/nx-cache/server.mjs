import {
  createReadStream,
  createWriteStream,
  existsSync,
  linkSync,
  mkdirSync,
  renameSync,
  rmSync,
} from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { argv } from 'node:process'

const dir = argv[2]
const restored = `${dir}.restored`
rmSync(restored, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
renameSync(dir, restored)
mkdirSync(dir)

createServer((req, res) => {
  const hash = /^\/v1\/cache\/(\w+)$/.exec(req.url)?.[1]
  if (!hash) return res.writeHead(404).end()
  const file = join(dir, hash)

  if (req.method === 'GET') {
    if (!existsSync(file) && existsSync(join(restored, hash))) linkSync(join(restored, hash), file)
    if (!existsSync(file)) return res.writeHead(404).end()
    return createReadStream(file).pipe(res)
  }

  if (existsSync(file)) return res.writeHead(409).end()
  req.pipe(createWriteStream(`${file}.tmp`)).on('finish', () => {
    renameSync(`${file}.tmp`, file)
    res.writeHead(202).end()
  })
}).listen(4911)
