import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { createRequire } from 'module'

import svgr from 'vite-plugin-svgr'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'

const basePath = process.env.VITE_PUBLIC_URL || '/map'

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: basePath,
  devtools: command === 'serve',
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
    // Only apply node polyfills for client build - Nitro server build uses native Node
    // {
    //   ...nodePolyfills({
    //     protocolImports: true,
    //     exclude: ['path', 'fs'],
    //     overrides: {
    //       net: join(__dirname, 'node-stubs/net.mjs'),
    //       child_process: join(__dirname, 'node-stubs/child_process.mjs'),
    //     },
    //   }),
    //   apply: (_config, env) => env.ssr === false,
    // },
    nxViteTsPaths(),
    tanstackStart({
      srcDirectory: '.',
      // server: {
      //   entry: 'ssr-entry.ts',
      // },
      router: {
        routesDirectory: 'routes',
        basepath: basePath,
      },
      spa: {
        enabled: true,
      },
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
    process.env.ANALYZE === 'true' &&
      visualizer({
        // Written to the app root so it's easy to open after the build
        filename: 'bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ],
  envPrefix: ['VITE_', 'i18n_'],
  ssr: {
    noExternal: ['@mastra/core', '@mastra/client-js'],
    // Prevent browser-only packages from being bundled into the SSR output.
    external: [
      'html2canvas',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/extensions',
      '@deck.gl/geo-layers',
      '@deck.gl/react',
      '@deck.gl/mesh-layers',
    ],
  },
}))
