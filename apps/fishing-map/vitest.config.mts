import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/apps/fishing-map',
  plugins: [react(), nxViteTsPaths()],
  test: {
    watch: false,
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'vitest-example/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
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
        },
        {
          browser: 'firefox',
          name: 'fishing-map-firefox',
        },
        {
          browser: 'webkit',
          name: 'fishing-map-webkit',
        },
      ],
    },
  },
})
