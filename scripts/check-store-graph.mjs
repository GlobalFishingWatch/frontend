#!/usr/bin/env node
/**
 * Walks the *runtime* import graph reachable from the store's root reducer and fails if any
 * heavyweight package is in it.
 *
 * Why this exists: `router.tsx` imports `makeStore` unconditionally, so everything statically
 * reachable from the reducer map lands in the entry chunk
 *
 * Two independent checks per entry: no FORBIDDEN package reachable, and the module count within budget.
 * The blocklist only catches what someone already thought of; the budget catches the rest.
 *
 * The walk crosses into workspace packages via their `exports` maps (see readWorkspacePackages below),
 * so a package barrel cannot hide a heavy dependency from it. Real npm packages stop the walk.
 *
 * Excluded from the walk, deliberately:
 *   - `import type` / type-only specifiers  (erased, cost nothing)
 *   - `await import()`                      (separate chunk, that's the whole point)
 *   - `.css` / image / font specifiers      (carry no JS, so they pull no runtime graph)
 *
 * Usage:
 *   node scripts/check-store-graph.mjs                     # the CI gate: every CHECKED_ENTRIES entry
 *   node scripts/check-store-graph.mjs --report            # + externals, traversed workspace packages
 *   node scripts/check-store-graph.mjs --from <entry>      # ad-hoc, unbudgeted
 *   node scripts/check-store-graph.mjs --all               # store/reducers.ts, i.e. every slice eager
 *   node scripts/check-store-graph.mjs --importers <name>  # every in-graph edge onto a module/package
 */
import { existsSync, globSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

import ts from 'typescript'

const REPO_ROOT = resolve(import.meta.dirname, '..')
const APP_ROOT = resolve(REPO_ROOT, 'apps/platform')

const ALWAYS_LOADED = ['routes/__root.tsx']

/**
 * Only slices still registered in store/reducers.ts belong here.
 */
const EAGER_SLICES = [
  'router/location.slice.ts',
  'features/_user/user.slice.ts',
  'features/modals/modals.slice.ts',
  'features/hints/hints.slice.ts',
  'features/debug/debug.slice.ts',
  'features/_map/datasets/datasets.slice.ts',
  'features/_map/dataviews/dataviews.slice.ts',
  'features/data/resources/resources.slice.ts',
]

/**
 * Every entry CI checks, with a ceiling on its static import graph.
 *
 * The budget exists because FORBIDDEN is a blocklist, and a blocklist only catches what someone already
 * thought of. The module count catches the rest: you cannot add a heavy import to one of these entries
 * without the number going up.
 *
 */
const CHECKED_ENTRIES = [
  {
    label: `__root + ${EAGER_SLICES.length} eager slices`,
    entries: [...ALWAYS_LOADED, ...EAGER_SLICES],
    maxModules: 120,
  },
  {
    label: 'routes/_platform.tsx (the Redux shell every page mounts)',
    entries: ['routes/_platform.tsx'],
    maxModules: 300,
  },
]

const checkAll = process.argv.includes('--all')
const fromArg = process.argv.indexOf('--from')

/** `--from` and `--all` are unbudgeted investigation modes; the default run is the CI gate. */
const RUNS =
  fromArg !== -1
    ? [{ label: process.argv[fromArg + 1], entries: [process.argv[fromArg + 1]] }]
    : checkAll
      ? [{ label: 'store/reducers.ts (all slices)', entries: ['store/reducers.ts'] }]
      : CHECKED_ENTRIES

/**
 * Packages that must never be statically reachable from the reducer map.
 * Each one costs the entry chunk of every page, including pages with no map.
 */
const FORBIDDEN = [
  '@deck.gl/',
  '@luma.gl/',
  '@loaders.gl/',
  '@globalfishingwatch/deck-layers',
  '@globalfishingwatch/deck-layer-composer',
  '@globalfishingwatch/deck-loaders',
  '@globalfishingwatch/timebar',
  '@turf/turf',
  '@strapi/client',
  'simple-statistics',
  'match-sorter',
  'recharts',
  'd3-geo',
  'd3-format',
  'd3-scale',
  'topojson-client',
  // react-aria-components was here until the platform nav adopted Disclosure/Button. It is now a
  // legitimate always-loaded dependency, so blocking it would only invite an ignore comment. What still
  // matters is *how* it is imported: use the `react-aria-components/<Component>` subpaths, never the root
  // barrel, which pulls every component. The module budgets below are what guards growth now.
]

// ---- workspace package resolution ---------------------------------------------------------------

/**
 * Every workspace package, resolved through its own `exports` map, so the walk crosses into our libs
 * instead of stopping at their package boundary.
 *
 * Why this matters: before this existed, only three hardcoded leaf subpaths were traversed and every
 * other `@globalfishingwatch/*` / `@platform/*` specifier counted as an opaque external. So the check
 * could not see that importing the `ui-components` root barrel put `match-sorter` (already on FORBIDDEN),
 * `d3-geo`, `topojson-client`, `d3-format` and `react-aria-components` in the entry chunk of every page —
 * it reported ✓ the whole time. A barrel is exactly where heavy deps hide, so not looking inside made
 * the pass close to meaningless.
 *
 * The package list comes from pnpm-workspace.yaml rather than a hardcoded `libs/*`, because
 * `@platform/config` lives under apps/ and is a real traversal target: it is how `data/map/config.ts`
 * reaches `datasets-client`, and therefore `d3-scale`, on the always-loaded path.
 *
 * WE DELIBERATELY RESOLVE TO SOURCE, NEVER dist. This is the one place the guard diverges from what
 * `vite build` does (build has no `development` condition, so it takes `default` -> dist):
 *   - dist may not exist. This target has no `^dist` dependency and CI runs it right after install.
 *   - stale dist gives a wrong answer silently, which is worse than no answer.
 *   - dist is a per-file tsc emit, so its import graph has the same shape as src. src is the same
 *     answer, fresher.
 *
 * Real npm packages still stop the walk — no node_modules traversal. The question here is "did *our*
 * code put a heavy dep in the entry chunk", and every heavy dep arrives through one of our modules.
 */
function readWorkspacePackages() {
  const manifest = readFileSync(resolve(REPO_ROOT, 'pnpm-workspace.yaml'), 'utf8')
  const globs = []
  let inPackages = false
  for (const rawLine of manifest.split('\n')) {
    if (/^packages:/.test(rawLine)) {
      inPackages = true
      continue
    }
    if (inPackages) {
      const entry = rawLine.match(/^\s+-\s*['"]?([^'"\s]+)['"]?\s*$/)
      if (entry) {
        globs.push(entry[1])
        continue
      }
      if (rawLine.trim() !== '') break // next top-level key
    }
  }

  const packages = new Map() // package name -> { dir, exports }
  for (const dir of globSync(globs, { cwd: REPO_ROOT })) {
    const manifestPath = resolve(REPO_ROOT, dir, 'package.json')
    if (!existsSync(manifestPath)) continue
    const pkg = JSON.parse(readFileSync(manifestPath, 'utf8'))
    if (!pkg.name) continue
    packages.set(pkg.name, { dir: resolve(REPO_ROOT, dir), exports: pkg.exports })
  }
  return packages
}

const WORKSPACE_PACKAGES = readWorkspacePackages()

/** Packages we could not resolve to a source file, with the reason. Reported, not silently dropped. */
const untraversed = new Map()

/** Workspace specifiers we did cross into: specifier -> resolved source file. */
const traversedWorkspace = new Map()

/**
 * Pick the source target for one `exports` entry, in descending order of trustworthiness.
 * Returns a package-relative path, or null if no candidate points into the package's source.
 */
function sourceTargetFor(entry, pkgDir) {
  if (typeof entry === 'string') return entry.startsWith('./dist/') ? null : entry
  if (!entry || typeof entry !== 'object') return null

  // 1. `development` — the libs/* convention, always src.
  if (typeof entry.development === 'string') return entry.development

  // 2/3. `default`/`types` when they already point into src — @platform/config and libs/skills ship
  //      raw source with no `development` condition.
  for (const condition of ['default', 'types']) {
    const target = entry[condition]
    if (
      typeof target === 'string' &&
      existsSync(resolve(pkgDir, target)) &&
      /^\.\/src\//.test(target)
    )
      return target
  }

  // 4. Last resort: rewrite a dist target back to its source. Only accepted if the file exists.
  const target = entry.default ?? entry.types
  if (typeof target === 'string') {
    const rewritten = target
      .replace(/^\.\/dist\//, './src/')
      .replace(/\.d\.ts$/, '.ts')
      .replace(/\.m?js$/, '.ts')
    if (existsSync(resolve(pkgDir, rewritten))) return rewritten
  }
  return null
}

/**
 * Resolve `@scope/pkg` or `@scope/pkg/subpath` to a source file via the package's `exports` map.
 * Exact keys beat wildcards; among wildcards the longest prefix wins.
 */
function resolveWorkspaceSpecifier(spec) {
  const parts = spec.split('/')
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
  const pkg = WORKSPACE_PACKAGES.get(name)
  if (!pkg) return null

  const subpath = spec === name ? '.' : `.${spec.slice(name.length)}`
  const fail = (reason) => {
    if (!untraversed.has(spec)) untraversed.set(spec, reason)
    return { kind: 'external', name }
  }

  if (!pkg.exports) return fail('no `exports` field')

  let target = null
  if (Object.hasOwn(pkg.exports, subpath)) {
    target = sourceTargetFor(pkg.exports[subpath], pkg.dir)
  } else {
    let bestPrefix = -1
    for (const [key, entry] of Object.entries(pkg.exports)) {
      if (!key.includes('*')) continue
      const [prefix, suffix = ''] = key.split('*')
      if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue
      if (prefix.length <= bestPrefix) continue
      const captured = subpath.slice(prefix.length, subpath.length - suffix.length)
      const pattern = sourceTargetFor(entry, pkg.dir)
      if (!pattern) continue
      bestPrefix = prefix.length
      target = pattern.replaceAll('*', captured)
    }
  }
  if (!target) return fail(`exports["${subpath}"] has no source target`)

  const found = resolveFile(resolve(pkg.dir, target))
  if (!found) return fail(`${target} does not exist`)
  traversedWorkspace.set(spec, { path: found, pkgDir: pkg.dir })
  return { kind: 'file', path: found }
}

// Mirrors compilerOptions.paths in apps/platform/tsconfig.json. Longest prefix wins.
const PATH_ALIASES = [
  ['assets/', 'assets/'],
  ['data/', 'data/'],
  ['features/', 'features/'],
  ['hooks/', 'hooks/'],
  ['pages/', 'pages/'],
  ['queries/', 'queries/'],
  ['router/', 'router/'],
  ['routes/', 'routes/'],
  ['server-functions/', 'server-functions/'],
  ['server/', 'server/'],
  ['test/', 'test/'],
  ['types/', 'types/'],
  ['utils/', 'utils/'],
]
const PATH_EXACT = {
  middlewares: 'store/middlewares',
  queries: 'queries',
  reducers: 'store/reducers',
  store: 'store/store',
  types: 'types',
}

const EXTENSIONS = ['.ts', '.tsx', '.mts', '.js', '.mjs', '.json']

function resolveFile(base) {
  if (existsSync(base) && statSync(base).isFile()) return base
  for (const ext of EXTENSIONS) {
    if (existsSync(base + ext)) return base + ext
  }
  for (const ext of EXTENSIONS) {
    const indexed = resolve(base, 'index' + ext)
    if (existsSync(indexed)) return indexed
  }
  return null
}

const ASSET_SPECIFIER = /\.(css|scss|sass|less|png|jpe?g|gif|svg|webp|avif|woff2?|ttf|eot)(\?.*)?$/

/** Specifiers dropped as carrying no JS. Expected, so reported apart from real resolver gaps. */
const droppedAssets = []

/** @returns {{kind: 'file', path: string} | {kind: 'external', name: string} | null} */
function resolveSpecifier(spec, fromFile) {
  // Stylesheets and assets carry no JS, so `import 'pkg/thing.css'` does not pull pkg's runtime graph.
  // Counting it as a package import reported @globalfishingwatch/timebar as reachable from
  // routes/_platform.tsx when all it costs there is a file of CSS custom properties.
  // Checked FIRST because `assets/images/menubg.jpg` otherwise matches the `assets/` path alias below,
  // resolves as a "file", and gets TS-parsed as a jpg — harmless, but it inflates the module count.
  if (ASSET_SPECIFIER.test(spec)) {
    droppedAssets.push(`${relative(REPO_ROOT, fromFile)} -> ${spec}`)
    return null
  }
  if (spec.startsWith('.')) {
    const found = resolveFile(resolve(dirname(fromFile), spec))
    return found ? { kind: 'file', path: found } : null
  }
  if (Object.hasOwn(PATH_EXACT, spec)) {
    const found = resolveFile(resolve(APP_ROOT, PATH_EXACT[spec]))
    return found ? { kind: 'file', path: found } : null
  }
  for (const [prefix, target] of PATH_ALIASES) {
    if (spec.startsWith(prefix)) {
      const found = resolveFile(resolve(APP_ROOT, target + spec.slice(prefix.length)))
      return found ? { kind: 'file', path: found } : null
    }
  }
  const workspace = resolveWorkspaceSpecifier(spec)
  if (workspace) return workspace
  // Bare specifier: a real npm package. Keep the scope+name, drop any subpath.
  const parts = spec.split('/')
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
  return { kind: 'external', name }
}

/** Runtime (non-type, non-dynamic) module specifiers of one source file. */
function runtimeSpecifiers(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
  const specs = []
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause
      // `import 'side-effect'` — no clause, always runtime.
      if (clause) {
        if (clause.isTypeOnly) continue
        const bindings = clause.namedBindings
        const allTypeOnly =
          !clause.name &&
          bindings &&
          ts.isNamedImports(bindings) &&
          bindings.elements.length > 0 &&
          bindings.elements.every((el) => el.isTypeOnly)
        if (allTypeOnly) continue
      }
      if (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        specs.push(statement.moduleSpecifier.text)
      }
    } else if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      if (statement.isTypeOnly) continue
      const clause = statement.exportClause
      const allTypeOnly =
        clause &&
        ts.isNamedExports(clause) &&
        clause.elements.length > 0 &&
        clause.elements.every((el) => el.isTypeOnly)
      if (allTypeOnly) continue
      if (ts.isStringLiteral(statement.moduleSpecifier)) specs.push(statement.moduleSpecifier.text)
    }
  }
  return specs
}

// ---- BFS ----------------------------------------------------------------------------------------

const report = process.argv.includes('--report')
const importersArg = process.argv.indexOf('--importers')

/** Walk one entry set. Returns everything the reporting below needs. */
function walk(entryPaths) {
  const entries = entryPaths.map((f) => resolve(APP_ROOT, f))
  const visited = new Set(entries)
  const externals = new Map() // package name -> importing file (first one seen)
  const parent = new Map() // file -> file that pulled it in, for blame paths
  const importers = new Map() // file or package -> every in-graph file importing it
  const unresolved = []
  const queue = [...entries]

  const addImporter = (key, file) => {
    if (!importers.has(key)) importers.set(key, new Set())
    importers.get(key).add(file)
  }

  while (queue.length) {
    const file = queue.shift()
    let specs
    try {
      specs = runtimeSpecifiers(file)
    } catch (error) {
      unresolved.push(`${relative(REPO_ROOT, file)}: parse failed \u2014 ${error.message}`)
      continue
    }
    for (const spec of specs) {
      const target = resolveSpecifier(spec, file)
      if (!target) {
        // Assets are recorded separately by resolveSpecifier; anything else is a real resolver gap.
        if (!ASSET_SPECIFIER.test(spec)) unresolved.push(`${relative(REPO_ROOT, file)} -> ${spec}`)
        continue
      }
      if (target.kind === 'external') {
        if (!externals.has(target.name)) externals.set(target.name, file)
        addImporter(target.name, file)
        continue
      }
      addImporter(target.path, file)
      if (visited.has(target.path)) continue
      visited.add(target.path)
      parent.set(target.path, file)
      queue.push(target.path)
    }
  }

  return { visited, externals, parent, importers, unresolved }
}

/** Import chain from an entry down to `file`, for blame output. */
function chainTo(file, parent) {
  const chain = [file]
  let cursor = file
  while (parent.has(cursor)) {
    cursor = parent.get(cursor)
    chain.push(cursor)
  }
  return chain.reverse().map((f) => relative(REPO_ROOT, f))
}

/**
 * `--importers <module-or-package>` lists every in-graph module importing it. `parent` only records the
 * first edge BFS happened to take, so chain output alone hides the other N-1 edges you also have to cut.
 */
if (importersArg !== -1) {
  const needle = process.argv[importersArg + 1]
  const { importers } = walk(RUNS.flatMap((run) => run.entries))
  const matches = [...importers.entries()].filter(([key]) =>
    key.startsWith('@') || !key.includes('/') ? key === needle : key.includes(needle)
  )
  if (!matches.length) {
    console.log(`no in-graph importers of "${needle}" (not reachable, or misspelled)`)
    process.exit(0)
  }
  for (const [key, files] of matches) {
    console.log(
      `\n${key.startsWith('/') ? relative(REPO_ROOT, key) : key} <- ${files.size} importer(s)`
    )
    for (const f of [...files].sort()) console.log(`  ${relative(REPO_ROOT, f)}`)
  }
  process.exit(0)
}

// ---- report -------------------------------------------------------------------------------------

let failed = false

for (const run of RUNS) {
  droppedAssets.length = 0
  untraversed.clear()
  traversedWorkspace.clear()

  const { visited, externals, parent, unresolved } = walk(run.entries)
  const budget = run.maxModules

  // Snapshot before the per-specifier sub-walks below, which reuse the same module-level collectors.
  const workspaceSpecifiers = [...traversedWorkspace]
  const droppedSnapshot = [...droppedAssets]
  const untraversedSnapshot = [...untraversed]

  console.log(
    `\nstore graph from ${run.label}: ${visited.size} app modules, ` +
      `${externals.size} external packages` +
      (budget === undefined ? '' : ` (budget ${budget})`)
  )

  if (report) {
    console.log('\nexternal npm packages (not traversed):')
    for (const name of [...externals.keys()].sort()) console.log(`  ${name}`)

    // Cost is measured PER SPECIFIER, not per package: the whole point of the leaf-subpath exports is
    // that `ui-components/dom-ids` and `ui-components` are wildly different imports of one package.
    // Deriving the shape from a sub-walk rather than declaring it in a table means the label cannot rot.
    if (workspaceSpecifiers.length) {
      console.log('\nworkspace packages traversed (modules each specifier pulls):')
      const rows = workspaceSpecifiers
        .map(([spec, { path }]) => [spec, path, walk([path]).visited.size])
        .sort((a, b) => b[2] - a[2] || a[0].localeCompare(b[0]))
      for (const [spec, path, count] of rows) {
        const shape = count === 1 ? 'leaf' : count < 10 ? 'small' : 'barrel'
        console.log(
          `  ${String(count).padStart(4)}  ${shape.padEnd(6)}  ${spec} -> ${relative(REPO_ROOT, path)}`
        )
      }
    }

    if (untraversedSnapshot.length) {
      console.log('\nworkspace packages NOT traversed (counted as external):')
      for (const [spec, reason] of untraversedSnapshot.sort()) console.log(`  ${spec} — ${reason}`)
    }
    if (droppedSnapshot.length) {
      console.log(`\ndropped, css/asset — carries no JS (${droppedSnapshot.length}):`)
      for (const a of droppedSnapshot) console.log(`  ${a}`)
    }
    if (unresolved.length) {
      console.log(`\nunresolved specifiers — resolver gaps (${unresolved.length}):`)
      for (const u of unresolved) console.log(`  ${u}`)
    }
  }

  const violations = [...externals.entries()].filter(([name]) =>
    FORBIDDEN.some((bad) => name === bad || name.startsWith(bad))
  )

  if (violations.length) {
    failed = true
    console.error(
      `\n\u2717 ${violations.length} forbidden package(s) reachable from ${run.label}:\n`
    )
    for (const [name, importer] of violations) {
      console.error(`  ${name}`)
      console.error(`    imported by ${relative(REPO_ROOT, importer)}`)
      console.error(`    run with \`--importers ${name}\` to see every edge you have to cut`)
      if (report) {
        for (const [i, step] of chainTo(importer, parent).entries()) {
          console.error(`      ${'  '.repeat(i)}${i === 0 ? '' : '-> '}${step}`)
        }
      }
    }
    console.error(
      '\nThese cost the entry chunk of every page, including pages with no map.' +
        (report ? '' : '\nRe-run with --report to see the full import chain.')
    )
  }

  if (budget !== undefined && visited.size > budget) {
    failed = true
    console.error(`\n\u2717 budget exceeded: ${run.label}`)
    console.error(`    ${visited.size} app modules (budget ${budget}, +${visited.size - budget})\n`)
    console.error('  Nothing here is forbidden \u2014 the graph just got bigger. Pick one:\n')
    console.error('  a) The import is not needed eagerly. Move it behind a lazy boundary')
    console.error(
      '     (`await import()`, a route-level split, or a leaf subpath instead of a package'
    )
    console.error('     barrel). Run with `--report` to list every workspace package this entry')
    console.error(
      '     traverses and how many of its modules landed in the graph \u2014 a package showing'
    )
    console.error('     up as `barrel` is the usual cause.\n')
    console.error('  b) The growth is intentional. Raise maxModules for this entry in')
    console.error('     scripts/check-store-graph.mjs and explain why in the commit message.')
    console.error(
      '     Budgets only ever go down; a silent bump is what this check exists to prevent.'
    )
  }
}

if (failed) process.exit(1)

console.log('\n\u2713 no forbidden packages reachable, every entry within budget')
