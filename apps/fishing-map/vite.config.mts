import { join } from 'path'

import svgr from 'vite-plugin-svgr'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { sentryTanstackStart } from '@sentry/tanstackstart-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'

const DEFAULT_BASE_PATH = process.env.NODE_ENV === 'production' ? '/map' : ''
const basePath =
  import.meta.env?.VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || DEFAULT_BASE_PATH

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
      routes: join(__dirname, 'routes'),
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
      // spa: {
      //   enabled: true,
      // },
    }),
    nitro({
      baseURL: basePath,
      rollupConfig: {
        external: ['assert', 'fsevents', 'chokidar', /^@vitejs\//, '@opentelemetry/api-logs'],
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
      sourcemaps: {
        assets: ['.output/public/**'],
      },
      telemetry: false,
    }),
  ],
  envPrefix: ['VITE_', 'i18n_'],
  ssr: {
    noExternal: ['@mastra/core', '@mastra/client-js'],
  },
})
