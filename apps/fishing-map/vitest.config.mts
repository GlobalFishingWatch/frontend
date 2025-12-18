import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: '.',
  cacheDir: '../../node_modules/.vite/apps/fishing-map',
  plugins: [react(), nxViteTsPaths()],
  resolve: {
    alias: {
      data: path.resolve(__dirname, './data'),
      features: path.resolve(__dirname, './features'),
      routes: path.resolve(__dirname, './routes'),
      services: path.resolve(__dirname, './services'),
      utils: path.resolve(__dirname, './utils'),
      'data/config': path.resolve(__dirname, './data/config'),
      types: path.resolve(__dirname, './types'),
      queries: path.resolve(__dirname, './queries'),
      middlewares: path.resolve(__dirname, './middlewares'),
      store: path.resolve(__dirname, './store'),
      appTestUtils: path.resolve(__dirname, './appTestUtils'),
    },
  },
  define: {
    'process.env.NEXT_PUBLIC_API_GATEWAY': JSON.stringify(process.env.NEXT_PUBLIC_API_GATEWAY),
  },
  test: {
    watch: false,
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'vitest-example/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '/apps/fishing-map/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/fishing-map',
      provider: 'v8' as const,
    },
    setupFiles: './vitest.setup.ts',
    browser: {
      enabled: true,
      provider: playwright(),
      trace: {
        screenshots: true,
        snapshots: true,
        mode: 'on',
      },
      instances: [
        {
          browser: 'chromium',
          name: 'fishing-map-browser',
          headless: true,
        },
        {
          browser: 'firefox',
          name: 'fishing-map-firefox',
          headless: true,
        },
        {
          browser: 'webkit',
          name: 'fishing-map-webkit',
          headless: true,
        },
      ],
    },
  },
})
