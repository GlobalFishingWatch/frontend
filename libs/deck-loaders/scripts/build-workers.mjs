/**
 * Bundles every `src/<group>/workers/*.ts` into a flat `dist/workers/*.js`.
 *
 * Replaces the previous `@nx/esbuild:esbuild` target, which could only emit into a
 * `workers-tmp` dir mirroring the source tree and then needed a rename pass to flatten it.
 * That dance relied on the executor's glob/outdir path handling and broke on Windows.
 * esbuild's `entryNames: '[name]'` flattens directly, so there is no temp dir and no renames.
 */
import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')
const outdir = path.join(root, 'dist', 'workers')

const entryPoints = fs
  .readdirSync(srcDir, { recursive: true })
  .map((entry) => path.join(srcDir, entry))
  .filter((file) => path.basename(path.dirname(file)) === 'workers' && file.endsWith('.ts'))

if (!entryPoints.length) {
  throw new Error(`No worker entry points found under ${srcDir}`)
}

const duplicates = entryPoints
  .map((file) => path.basename(file))
  .filter((name, i, names) => names.indexOf(name) !== i)
if (duplicates.length) {
  throw new Error(
    `Worker file names must be unique, they are flattened into dist/workers: ${duplicates.join(', ')}`
  )
}

fs.rmSync(outdir, { recursive: true, force: true })

await build({
  entryPoints,
  outdir,
  entryNames: '[name]',
  tsconfig: path.join(root, 'tsconfig.workers.json'),
  bundle: true,
  format: 'iife',
  target: 'esnext',
  platform: 'browser',
  minify: true,
  define: { 'import.meta.env': '"{}"' },
})

console.log(`Bundled ${entryPoints.length} workers into ${path.relative(process.cwd(), outdir)}`)
