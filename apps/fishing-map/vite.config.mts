import { join } from 'path'

import svgr from 'vite-plugin-svgr'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { sentryTanstackStart } from '@sentry/tanstackstart-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const basePath = process.env.NEXT_PUBLIC_URL || '/map'

export default defineConfig({
  root: __dirname,
  base: basePath,
  resolve: {
    alias: {
      assets: join(__dirname, 'assets'),
      data: join(__dirname, 'data'),
      features: join(__dirname, 'features'),
      hooks: join(__dirname, 'hooks'),
      middlewares: join(__dirname, 'middlewares.ts'),
      queries: join(__dirname, 'queries'),
      reducers: join(__dirname, 'reducers.ts'),
      router: join(__dirname, 'router'),
      server: join(__dirname, 'server'),
      store: join(__dirname, 'store.ts'),
      types: join(__dirname, 'types'),
      utils: join(__dirname, 'utils'),
    },
  },
  server: {
    port: 3003,
    strictPort: true,
  },
  plugins: [
    nxViteTsPaths(),
    tanstackStart({
      srcDirectory: '.',
      router: {
        routesDirectory: 'routes',
        basepath: basePath,
      },
      spa: {
        enabled: true,
      },
    }),
    react(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    sentryTanstackStart({
      org: 'global-fishing-watch',
      project: 'frontend',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  envPrefix: ['VITE_', 'i18n_'],
  ssr: {
    noExternal: ['@mastra/core', '@mastra/client-js'],
  },
})
