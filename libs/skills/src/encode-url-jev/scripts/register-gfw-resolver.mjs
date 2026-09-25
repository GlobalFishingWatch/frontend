import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Each skill ships its own self-contained bundle next to it. Resolve it from either layout:
// - dist/<skill>/scripts (dist output, this skill copied standalone) -> ../index.js
// - <skill>/scripts (monorepo source, unbuilt) -> ../../dist/<skill>/index.js
const skillDir = fileURLToPath(new URL('..', import.meta.url))
const skillName = path.basename(skillDir)
const SPECIFIER = `@globalfishingwatch/skills/${skillName}`
const BUNDLE = [
  path.join(skillDir, 'index.js'),
  path.join(skillDir, '..', '..', 'dist', skillName, 'index.js'),
].find(existsSync)

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === SPECIFIER && BUNDLE) {
      return { url: pathToFileURL(BUNDLE).href, format: 'module', shortCircuit: true }
    }
    return nextResolve(specifier, context)
  },
})
