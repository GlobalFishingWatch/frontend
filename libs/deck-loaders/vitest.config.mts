import { defineConfig } from 'vite'

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/deck-loaders',
  resolve: { tsconfigPaths: true },
  test: {
    name: 'deck-loaders',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/deck-loaders',
      provider: 'v8' as const,
    },
  },
}))
