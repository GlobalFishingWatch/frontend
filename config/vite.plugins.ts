import type { Plugin, ViteDevServer } from 'vite'

const virtualCssPath = '/@virtual:ssr-css.css'

const collectedStyles = new Map<string, string>()

export function pluginSSRCssModuleFix(): Plugin {
  let server: ViteDevServer

  return {
    name: 'ssr-dev-cssModules-fix',
    apply: 'serve',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return null
      if (id.includes('.css')) {
        collectedStyles.set(id, code)
      }
      return null
    },
    configureServer(server_) {
      server = server_

      server.middlewares.use((req, _res, next) => {
        if (req.url === virtualCssPath) {
          _res.setHeader('Content-Type', 'text/css')
          _res.write(Array.from(collectedStyles.values()).join('\n'))
          _res.end()
          return
        }
        next()
      })
    },
    transformIndexHtml: {
      handler: async () => {
        return [
          {
            tag: 'link',
            injectTo: 'head',
            attrs: {
              rel: 'stylesheet',
              href: virtualCssPath,
            },
          },
        ]
      },
    },
  }
}
