// @ts-nocheck - virtual modules resolved by nitro bundler
import { useNitroApp } from 'nitro/app'
import http from 'node:http'
import http2 from 'node:http2'
import net from 'node:net'

import '#nitro/virtual/polyfills'

const parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? '')
const port = Number.isNaN(parsedPort) ? 3000 : parsedPort
const host = process.env.NITRO_HOST || process.env.HOST

const nitroApp = useNitroApp()

async function handler(req, res) {
  try {
    const method = req.method ?? 'GET'
    const authority = req.headers[':authority'] ?? req.headers['host'] ?? 'localhost'
    const url = `http://${authority}${req.url ?? '/'}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (!key.startsWith(':')) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value)
      }
    }

    let body
    if (method !== 'GET' && method !== 'HEAD') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      if (chunks.length) body = Buffer.concat(chunks)
    }

    const response = await nitroApp.fetch(new Request(url, { method, headers, body }))

    const resHeaders = {}
    response.headers.forEach((value, key) => {
      resHeaders[key] = value
    })
    res.writeHead(response.status, resHeaders)

    if (response.body) {
      for await (const chunk of response.body) res.write(chunk)
    }
    res.end()
  } catch (err) {
    console.error('[h2c] handler error:', err)
    if (!res.headersSent) {
      try {
        res.writeHead(500)
        res.end()
      } catch {}
    } else if (!res.writableEnded) {
      try {
        res.end()
      } catch {}
    }
  }
}

const h1Server = http.createServer(handler)
// h2c (HTTP/2 cleartext) — Cloud Run terminates TLS at the load balancer and
// forwards h2c to the container, so the server must speak HTTP/2 without TLS.
const h2Server = http2.createServer({}, handler)

// Peek at the first 3 bytes to detect the HTTP/2 connection preface ("PRI").
// Bytes are unshifted back before routing so neither server misses them.
const server = net.createServer((socket) => {
  socket.once('readable', () => {
    const head = socket.read(3)
    if (!head) {
      socket.destroy()
      return
    }
    socket.unshift(head)
    const target = head.toString('ascii', 0, 3) === 'PRI' ? h2Server : h1Server
    target.emit('connection', socket)
  })
})

server.listen(port, host, () => {
  console.log(`Listening on http://${host ?? '0.0.0.0'}:${port}`)
})

process.on('unhandledRejection', (err) => {
  console.error('[h2c] unhandledRejection', err)
})

export default {}
