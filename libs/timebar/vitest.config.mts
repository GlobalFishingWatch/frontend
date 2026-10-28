import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/timebar',
  resolve: { tsconfigPaths: true },
  // ui-components' Icon loads its SVGs with `?react` (resolved from lib src in tests)
  plugins: [react(), svgr({ include: ['**/*.svg?react'] })],
  test: {
    name: 'timebar',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/timebar',
      provider: 'v8' as const,
    },
  },
}))
