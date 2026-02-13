import { defineConfig } from 'vite'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/api-client',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'api-client',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/api-client',
      provider: 'v8' as const,
      include: ['src/api-client.ts'],
      exclude: ['src/**/*.spec.ts', 'src/utils/**'],
    },
  },
}))
