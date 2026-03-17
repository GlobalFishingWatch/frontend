import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import type { IncomingMessage, ServerResponse } from 'http'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_PATH = path.resolve(__dirname, '../../.auth/tokens.json')

// Plugin to transform SVG imports for testing
export const svgMockPlugin = (): Plugin => ({
  name: 'svg-mock',
  transform(_code: string, id: string) {
    if (id.endsWith('.svg')) {
      return {
        code: 'export default () => null',
        map: null,
      }
    }
  },
})

// Plugin to serve public assets from /map path, this is needed because not having events-color-sprite.png causes timebar to throw an error an not load any events
export const publicAssetsPlugin = (): Plugin => ({
  name: 'public-assets',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url?.startsWith('/map/')) {
          req.url = req.url.replace('/map/', '/')
        }
        next()
      }
    )
  },
  configurePreviewServer(server: PreviewServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url?.startsWith('/map/')) {
          req.url = req.url.replace('/map/', '/')
        }
        next()
      }
    )
  },
})

// Plugin to serve auth tokens file to browser tests
export const authTokensPlugin = (): Plugin => ({
  name: 'auth-tokens',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url === '/.auth/tokens.json') {
          if (fs.existsSync(TOKENS_PATH)) {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            const tokens = fs.readFileSync(TOKENS_PATH, 'utf-8')
            res.end(tokens)
          } else {
            res.statusCode = 404
            res.end(JSON.stringify({ token: '', refreshToken: '' }))
          }
          return
        }
        next()
      }
    )
  },
  configurePreviewServer(server: PreviewServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url === '/.auth/tokens.json') {
          if (fs.existsSync(TOKENS_PATH)) {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            const tokens = fs.readFileSync(TOKENS_PATH, 'utf-8')
            res.end(tokens)
          } else {
            res.statusCode = 404
            res.end(JSON.stringify({ token: '', refreshToken: '' }))
          }
          return
        }
        next()
      }
    )
  },
})
