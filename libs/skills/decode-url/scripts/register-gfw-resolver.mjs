import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Allows running these scripts with plain node in two layouts:
// - GFW monorepo: @globalfishingwatch/* resolve to the sibling libs/*/dist builds
// - installed package: siblings live in node_modules/@globalfishingwatch/*
// Also fixes the extensionless relative imports those dist builds contain,
// which node ESM cannot load natively.
const PACKAGES_DIR = fileURLToPath(new URL('../../..', import.meta.url))

const asModule = (filePath) => ({
  url: pathToFileURL(filePath).href,
  format: 'module',
  shortCircuit: true,
})

registerHooks({
  resolve(specifier, context, nextResolve) {
    const gfwPackage = specifier.match(/^@globalfishingwatch\/([\w-]+)$/)?.[1]
    if (gfwPackage) {
      const local = path.join(PACKAGES_DIR, gfwPackage, 'dist/index.js')
      if (existsSync(local)) {
        return asModule(local)
      }
    }
    try {
      const resolved = nextResolve(specifier, context)
      const inPackagesDir = resolved.url.startsWith(pathToFileURL(PACKAGES_DIR).href)
      if (inPackagesDir && resolved.url.endsWith('.js')) {
        return { ...resolved, format: 'module' }
      }
      return resolved
    } catch (error) {
      if (specifier.startsWith('.') && context.parentURL) {
        const base = fileURLToPath(new URL(specifier, context.parentURL))
        for (const candidate of [`${base}.js`, path.join(base, 'index.js')]) {
          if (existsSync(candidate)) {
            return asModule(candidate)
          }
        }
      }
      throw error
    }
  },
})
