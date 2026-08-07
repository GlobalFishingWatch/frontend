import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/deck-layer-composer',
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    name: 'deck-layer-composer',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/deck-layer-composer',
      provider: 'v8' as const,
    },
  },
}))
