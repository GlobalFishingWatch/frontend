import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// dist/index.js is a self-contained bundle. Resolve it from either layout:
// - encode-url/scripts (package root) -> ../../dist/index.js
// - dist/encode-url/scripts (dist output) -> ../../index.js
const SKILLS_DIST = [
  fileURLToPath(new URL('../../index.js', import.meta.url)),
  fileURLToPath(new URL('../../dist/index.js', import.meta.url)),
].find((candidate) => existsSync(candidate))

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@globalfishingwatch/skills' && existsSync(SKILLS_DIST)) {
      return { url: pathToFileURL(SKILLS_DIST).href, format: 'module', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
})
