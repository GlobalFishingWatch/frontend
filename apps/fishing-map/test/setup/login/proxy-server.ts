import { once } from 'events'
import { createServer } from 'http'

import { ACCESS_TOKEN_STRING, GFWAPI } from '@globalfishingwatch/api-client'

const PROXY_PORT = 3003
const PROXY_HOST = `localhost:${PROXY_PORT}`

export async function startAuthProxyServer() {
  const { promise: accessTokenPromise, resolve, reject } = Promise.withResolvers<string>()

  const server = createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${PROXY_HOST}`)

    if (url.pathname === '/login') {
      res.writeHead(302, { Location: GFWAPI.getLoginUrl(`http://${PROXY_HOST}/auth/callback`) })
      res.end()
      return
    }

    if (url.pathname === '/auth/callback') {
      const accessToken = url.searchParams.get(ACCESS_TOKEN_STRING)
      if (accessToken) {
        resolve(accessToken)
      } else {
        reject(new Error(`Callback URL did not include "${ACCESS_TOKEN_STRING}" query parameter`))
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(
        '<html><body><h1>Authentication complete</h1><p>You can close this page.</p></body></html>'
      )
      return
    }

    res.writeHead(404)
    res.end('Not found')
  })

  server.listen(PROXY_PORT, 'localhost')
  await once(server, 'listening')

  return {
    server,
    loginUrl: `http://${PROXY_HOST}/login`,
    waitForAccessToken: () => accessTokenPromise,
  }
}
