import svgr from 'vite-plugin-svgr'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const basePath = import.meta.env?.VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || '/map'

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: basePath,
  devtools: command === 'serve',
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3003,
    strictPort: true,
    allowedHosts: ['local.globalfishingwatch.org'],
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
        enabled: false,
      },
    }),
    react(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    command === 'build' &&
      nitro({
        config: {
          baseURL: basePath,
          rollupConfig: {
            external: ['assert', 'fsevents', 'chokidar', /^@vitejs\//, '@opentelemetry/api-logs'],
            // Keep an eye in these issues to remove these shims when possible:
            // https://github.com/vitejs/vite/issues/22291
            // https://github.com/rolldown/rolldown/issues/9441
            plugins: [
              {
                // CJS packages bundled into ESM lose __dirname/__filename.
                // Replace with import.meta equivalents (Node 21.2+).
                name: 'shim-cjs-globals',
                renderChunk(code: string) {
                  if (!code.includes('__dirname') && !code.includes('__filename')) return null
                  // Skip declarations (const/let/var __dirname = ...) — those are ESM-safe
                  // patterns like `const __dirname = dirname(fileURLToPath(import.meta.url))`.
                  // Only replace bare references that lack a runtime value in ESM scope.
                  const replaced = code
                    .replace(/(?<!(?:const|let|var) )__dirname\b/g, 'import.meta.dirname')
                    .replace(/(?<!(?:const|let|var) )__filename\b/g, 'import.meta.filename')
                  if (replaced === code) return null
                  return { code: replaced, map: null }
                },
              },
              {
                // Nitro inlines Vite SSR chunks causing a circular reference:
                // __exportAll (a var) is called before its declaration runs.
                // Fix: convert the existing var to a function declaration (fully
                // hoisted) that uses Object.defineProperty directly so it has
                // no dependency on __defProp which is also not yet initialized.
                name: 'fix-exportall-hoisting',
                renderChunk(code: string) {
                  const firstUseIdx = code.indexOf('__exportAll(')
                  if (firstUseIdx === -1) return null
                  const defMarker = '\nvar __exportAll = (all, no_symbols) => {\n'
                  const varDefIdx = code.indexOf(defMarker)
                  if (varDefIdx === -1 || varDefIdx < firstUseIdx) return null
                  // Find end of definition by brace-depth tracking
                  let depth = 1
                  let pos = varDefIdx + defMarker.length
                  while (pos < code.length && depth > 0) {
                    const ch = code[pos++]
                    if (ch === '{') depth++
                    else if (ch === '}') depth--
                  }
                  while (pos < code.length && (code[pos] === ';' || code[pos] === '\n')) pos++
                  // Self-contained hoisted function (no __defProp dependency)
                  const funcDecl =
                    '\nfunction __exportAll(all, no_symbols) {\n' +
                    '\tvar _dp = Object.defineProperty;\n' +
                    '\tvar target = {};\n' +
                    '\tfor (var name in all) _dp(target, name, { get: all[name], enumerable: true });\n' +
                    '\tif (!no_symbols) _dp(target, Symbol.toStringTag, { value: "Module" });\n' +
                    '\treturn target;\n' +
                    '}\n'
                  // Remove var definition, insert function declaration after last import
                  const withoutDef = code.slice(0, varDefIdx) + code.slice(pos)
                  const lastImport = [...withoutDef.matchAll(/^import .+;$/gm)].pop()
                  if (!lastImport?.index) return null
                  const insertPos = lastImport.index + lastImport[0].length
                  return {
                    code: withoutDef.slice(0, insertPos) + funcDecl + withoutDef.slice(insertPos),
                    map: null,
                  }
                },
              },
            ],
          },
        },
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
  environments: {
    ssr: { build: { rollupOptions: { input: './server.ts' } } },
  },
  ssr: {
    noExternal: ['@mastra/core', '@mastra/client-js'],
    // Prevent browser-only packages from being bundled into the SSR output.
    external: [
      'html2canvas',
      'papaparse',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/extensions',
      '@deck.gl/geo-layers',
      '@deck.gl/react',
      '@deck.gl/mesh-layers',
    ],
  },
}))
