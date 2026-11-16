/**
 * Asserts on the matching rules, run before every `check-load-boundaries`. Each assert pins a bug
 * this guard once had or nearly had. Not a vitest spec: platform's vitest runs in a browser.
 */
import assert from 'node:assert/strict'
import { resolve } from 'node:path'

import {
  carriesJs,
  forbiddenReason,
  libKey,
  matchesPackage,
  packageNameOf,
  REPO_ROOT,
} from './shared.ts'
import { walkSource } from './source-graph.ts'

// Exact names stay exact; only a trailing `/` opens a scope. `d3-scale` once matched by prefix.
assert.equal(matchesPackage('d3-scale-chromatic', ['d3-scale']), false)
assert.equal(matchesPackage('@deck.gl/core', ['@deck.gl/']), true)
assert.equal(packageNameOf('@scope/pkg/sub/path'), '@scope/pkg')
assert.equal(packageNameOf('pkg/sub'), 'pkg')

// A CSS module is JS (class-name map) and must be walked; plain CSS and images must not.
assert.equal(carriesJs('./Link.module.css'), true)
assert.equal(carriesJs('@globalfishingwatch/timebar/timebar-settings.css'), false)
assert.equal(carriesJs('assets/images/menubg.jpg'), false)

// Source mode sees lib src, build mode sees lib dist: both must name the same module.
const lib = (path: string) => resolve(REPO_ROOT, 'libs/deck-layers', path)
assert.equal(libKey(lib('src/config/index.ts')), libKey(lib('dist/config/index.js')))

// Workspace libs are walked into, so their own package rule must fire. The first version of this
// guard only matched npm packages and never reported @globalfishingwatch/* at all.
const forbid = { packages: ['@globalfishingwatch/deck-layers'] }
assert.equal(
  forbiddenReason(lib('src/index.ts'), forbid, new Set()),
  '@globalfishingwatch/deck-layers'
)
assert.equal(
  forbiddenReason(lib('src/index.ts'), forbid, new Set([libKey(lib('src/index.ts'))])),
  null
)

// The resolver follows the `development` condition into lib src instead of stopping at the package.
const walk = walkSource(['routes/_platform.tsx'])
assert.ok(
  [...walk.files].some((f) => /\/libs\/[^/]+\/src\//.test(f)),
  'expected the walk to cross into libs/*/src'
)
assert.ok(
  ![...walk.files].some((f) => /\/libs\/[^/]+\/dist\//.test(f)),
  'the walk must never read lib dist'
)

console.log('load-boundaries selfcheck ok')
