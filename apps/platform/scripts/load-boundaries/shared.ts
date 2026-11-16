/**
 * Pieces both graph sources share: where things live, which package a file belongs to, and how a
 * check's `forbid` rules are evaluated against whatever a walk reached.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'

export const APP_ROOT = resolve(import.meta.dirname, '../..')
export const REPO_ROOT = resolve(APP_ROOT, '../..')
/** Written by chunk-graph.plugin.ts during `vite build`, read by build mode. */
export const CHUNK_GRAPH_FILE = resolve(APP_ROOT, 'dist/chunk-graph.json')
export const CLIENT_OUTPUT_DIR = resolve(APP_ROOT, '.output/public')

/** Specifiers that carry no JS: stylesheets, images, fonts. */
export const ASSET = /\.(css|scss|sass|less|png|jpe?g|gif|svg|webp|avif|woff2?|ttf|eot)(\?.*)?$/
/** A CSS module compiles to JS (its class-name map), so it is a module of the graph, not an asset. */
export const CSS_MODULE = /\.module\.(css|scss|sass|less)$/
export const carriesJs = (path: string) => CSS_MODULE.test(path) || !ASSET.test(path)

export const fromApp = (file: string) => resolve(APP_ROOT, file)
export const appRelative = (file: string) => relative(APP_ROOT, file)
export const repoRelative = (file: string) => relative(REPO_ROOT, file)
export const isAppFile = (file: string) =>
  file.startsWith(APP_ROOT + sep) && !file.includes(`${sep}node_modules${sep}`)

export type Forbid = {
  /** Package names. A trailing `/` matches a whole scope (`@deck.gl/`), anything else is exact. */
  packages?: string[]
  /** App-relative path prefixes (`features/_map/`). */
  modules?: string[]
  /** App-relative files exempt from `modules`. Each one must still be reached, or it is stale. */
  allow?: string[]
  /**
   * Light subpaths of a forbidden workspace package (`@globalfishingwatch/timebar/constants`). The
   * modules a subpath reaches inside its own package are exempt. Each one must still be imported.
   */
  allowSubpaths?: string[]
  /** Specifiers that must not be imported as written. Source mode only: a bundle has no specifiers. */
  barrels?: string[]
}

export type Check = {
  label: string
  /** App-relative files that load together. Walked as one graph. */
  entries: string[]
  /** Whatever these reach is the baseline's problem, so it is not held against this check. */
  baseline?: string[]
  /** Source mode budget: modules statically reachable from `entries`, our code and libs. */
  maxModules?: number
  forbid: Forbid
  /** Why this check exists. Printed when it fails. */
  why: string
}

export const matchesPackage = (name: string, patterns: string[] = []) =>
  patterns.some((pattern) => (pattern.endsWith('/') ? name.startsWith(pattern) : name === pattern))

const packageCache = new Map<string, string | null>()

/** Name of the nearest package.json that has one. Libs and @platform/config resolve to their own. */
export function packageOf(file: string): string | null {
  const walked: string[] = []
  let dir = dirname(file)
  let name: string | null = null
  for (;;) {
    if (packageCache.has(dir)) {
      name = packageCache.get(dir)!
      break
    }
    walked.push(dir)
    const manifest = resolve(dir, 'package.json')
    if (existsSync(manifest)) {
      const pkg = JSON.parse(readFileSync(manifest, 'utf8'))
      // Nested `{"type": "module"}` manifests inside a package have no name; keep walking.
      if (pkg.name) {
        name = pkg.name
        break
      }
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  for (const d of walked) packageCache.set(d, name)
  return name
}

export const APP_PACKAGE = packageOf(resolve(APP_ROOT, 'package.json'))!

/** Bare specifier to package name: `@scope/pkg/sub` -> `@scope/pkg`, `pkg/sub` -> `pkg`. */
export function packageNameOf(spec: string) {
  const parts = spec.split('/')
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

/**
 * One key for a lib module whether it was reached as src (source mode) or dist (build mode).
 * Sound because each lib's dist is a per-file tsc emit of its src.
 */
export const libKey = (file: string) =>
  repoRelative(file)
    .replace(/^(libs\/[^/]+)\/(?:src|dist)\//, '$1/')
    .replace(/\.(d\.ts|tsx?|m?js)$/, '')

/**
 * Why `file` is off limits for this check, or null. A file is forbidden when its own package is
 * (unless an allowed subpath reaches it: `exempt` holds their libKeys), or when it sits under a
 * forbidden app folder and is not allowlisted.
 */
export function forbiddenReason(file: string, forbid: Forbid, exempt: Set<string>): string | null {
  const pkg = packageOf(file)
  if (pkg && pkg !== APP_PACKAGE && matchesPackage(pkg, forbid.packages)) {
    return exempt.has(libKey(file)) ? null : pkg
  }
  if (!isAppFile(file)) return null
  const rel = appRelative(file)
  if (forbid.allow?.includes(rel)) return null
  const prefix = forbid.modules?.find((p) => rel.startsWith(p))
  return prefix ?? null
}
