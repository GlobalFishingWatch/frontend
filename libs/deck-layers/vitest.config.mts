import { defineConfig } from 'vite'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/deck-layers',
  resolve: {
    tsconfigPaths: true,
    alias: {
      // wgsl_reflect (luma.gl dep) ships a CJS "main" inside a type:module
      // package, which breaks named exports under vitest SSR — use its ESM build
      wgsl_reflect: 'wgsl_reflect/wgsl_reflect.module.js',
    },
  },
  test: {
    name: 'deck-layers',
    watch: false,
    globals: true,
    environment: 'node',
    server: {
      deps: {
        // process the whole luma/deck test-utils chain through vite so the
        // wgsl_reflect alias applies (its published "main" is CJS in a
        // type:module package and crashes native node ESM resolution)
        inline: [/@luma\.gl\//, /@deck\.gl\/test-utils/, 'wgsl_reflect'],
      },
    },
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/deck-layers',
      provider: 'v8' as const,
    },
  },
}))
