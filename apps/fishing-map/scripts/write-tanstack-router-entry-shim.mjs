import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const chunksDir = join(appRoot, '.output/server/chunks/build')
const shimPath = join(
  appRoot,
  '.output/server/node_modules/@tanstack/start-server-core/dist/esm/tanstack-router-entry-shim.js',
)

if (!existsSync(chunksDir)) {
  console.warn('write-tanstack-router-entry-shim: no .output/server/chunks/build; skipping')
  process.exit(0)
}

const routerChunks = readdirSync(chunksDir).filter(
  (name) => name.startsWith('router-') && name.endsWith('.mjs'),
)

if (routerChunks.length === 0) {
  throw new Error(
    `write-tanstack-router-entry-shim: no router-*.mjs under ${chunksDir}`,
  )
}

if (routerChunks.length > 1) {
  throw new Error(
    `write-tanstack-router-entry-shim: expected one router-*.mjs, found: ${routerChunks.join(', ')}`,
  )
}

const chunkAbs = join(chunksDir, routerChunks[0])
const shimDir = join(shimPath, '..')
let rel = relative(shimDir, chunkAbs)
rel = rel.split('\\').join('/')
if (!rel.startsWith('.')) {
  rel = './' + rel
}

const out = `export * from "${rel}";\n`

writeFileSync(shimPath, out, 'utf8')
console.info(`write-tanstack-router-entry-shim: ${relative(appRoot, shimPath)} -> ${rel}`)
