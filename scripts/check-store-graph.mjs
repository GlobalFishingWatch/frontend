#!/usr/bin/env node
/**
 * Walks the *runtime* import graph reachable from the store's root reducer and fails if any
 * heavyweight package is in it.
 *
 * Why this exists: `router.tsx` imports `makeStore` unconditionally, so everything statically
 * reachable from the reducer map lands in the entry chunk — including, historically, all of
 * deck.gl, via `features/user/user.slice.ts` -> `features/workspace/workspace.slice`. Bundle-size
 * budgets are too coarse to catch that edge coming back; this is exact and runs in under a second.
 *
 * Excluded from the walk, deliberately:
 *   - `import type` / type-only specifiers  (erased, cost nothing)
 *   - `await import()`                      (separate chunk, that's the whole point)
 *
 * Usage:
 *   node scripts/check-store-graph.mjs            # check, exit 1 on violation
 *   node scripts/check-store-graph.mjs --report   # print the graph and why each offender is reachable
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
// Root package.json aliases `typescript` -> `@typescript/typescript6`; import via the alias.
import ts from 'typescript'

const REPO_ROOT = resolve(import.meta.dirname, '..')
const APP_ROOT = resolve(REPO_ROOT, 'apps/platform')

/**
 * The slices that must stay eagerly registered (platform-global, or needed synchronously at store
 * creation). Once the lazy split lands this is what the entry chunk actually pays for, so the check
 * runs against these rather than against the whole of reducers.ts.
 *
 * `--all` checks reducers.ts instead, i.e. the pre-split state of the world.
 */
/**
 * The document shell. Loaded on EVERY page including the platform landing, so it is the strictest
 * entry: nothing heavy may be statically reachable from here.
 */
const ALWAYS_LOADED = ['routes/__root.tsx']

const EAGER_SLICES = [
  'router/location.slice.ts',
  'features/user/user.slice.ts',
  'features/modals/modals.slice.ts',
  'features/hints/hints.slice.ts',
  'features/app/print.slice.ts',
  'features/debug/debug.slice.ts',
  'features/map/datasets/datasets.slice.ts',
  'features/map/dataviews/dataviews.slice.ts',
  'features/data/resources/resources.slice.ts',
]

const checkAll = process.argv.includes('--all')
const fromArg = process.argv.indexOf('--from')
const ENTRIES =
  fromArg !== -1
    ? [resolve(APP_ROOT, process.argv[fromArg + 1])]
    : checkAll
      ? [resolve(APP_ROOT, 'reducers.ts')]
      : [...ALWAYS_LOADED, ...EAGER_SLICES].map((f) => resolve(APP_ROOT, f))

/**
 * Packages that must never be statically reachable from the reducer map.
 * Each one costs the entry chunk of every page, including pages with no map.
 */
const FORBIDDEN = [
  '@deck.gl/',
  '@globalfishingwatch/deck-layers',
  '@globalfishingwatch/deck-layer-composer',
  '@globalfishingwatch/timebar',
  '@turf/turf',
  '@strapi/client',
  'simple-statistics',
  'match-sorter',
]

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
  middlewares: 'middlewares',
  queries: 'queries',
  reducers: 'reducers',
  store: 'store',
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

/** @returns {{kind: 'file', path: string} | {kind: 'external', name: string} | null} */
function resolveSpecifier(spec, fromFile) {
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
  // Bare specifier: a package. Keep the scope+name, drop any subpath.
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

const visited = new Set(ENTRIES)
const externals = new Map() // package name -> importing file (first one seen)
const parent = new Map() // file -> file that pulled it in, for blame paths
const unresolved = []
const queue = [...ENTRIES]

while (queue.length) {
  const file = queue.shift()
  let specs
  try {
    specs = runtimeSpecifiers(file)
  } catch (error) {
    unresolved.push(`${relative(REPO_ROOT, file)}: parse failed — ${error.message}`)
    continue
  }
  for (const spec of specs) {
    const target = resolveSpecifier(spec, file)
    if (!target) {
      unresolved.push(`${relative(REPO_ROOT, file)} -> ${spec}`)
      continue
    }
    if (target.kind === 'external') {
      if (!externals.has(target.name)) externals.set(target.name, file)
      continue
    }
    if (visited.has(target.path)) continue
    visited.add(target.path)
    parent.set(target.path, file)
    queue.push(target.path)
  }
}

/** Import chain from the entry down to `file`, for blame output. */
function chainTo(file) {
  const chain = [file]
  let cursor = file
  while (parent.has(cursor)) {
    cursor = parent.get(cursor)
    chain.push(cursor)
  }
  return chain.reverse().map((f) => relative(REPO_ROOT, f))
}

const violations = [...externals.entries()].filter(([name]) =>
  FORBIDDEN.some((bad) => name === bad || name.startsWith(bad))
)

const report = process.argv.includes('--report')

const entryLabel =
  fromArg !== -1
    ? process.argv[fromArg + 1]
    : checkAll
      ? 'reducers.ts (all slices)'
      : `__root + ${EAGER_SLICES.length} eager slices`
console.log(
  `store graph from ${entryLabel}: ${visited.size} app modules, ${externals.size} external packages`
)

if (report) {
  console.log('\nexternal packages:')
  for (const name of [...externals.keys()].sort()) console.log(`  ${name}`)
  if (unresolved.length) {
    console.log(`\nunresolved specifiers (${unresolved.length}):`)
    for (const u of unresolved) console.log(`  ${u}`)
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} forbidden package(s) reachable from the reducer map:\n`)
  for (const [name, importer] of violations) {
    console.error(`  ${name}`)
    console.error(`    imported by ${relative(REPO_ROOT, importer)}`)
    if (report) {
      for (const [i, step] of chainTo(importer).entries()) {
        console.error(`      ${'  '.repeat(i)}${i === 0 ? '' : '-> '}${step}`)
      }
    }
  }
  console.error(
    '\nThese cost the entry chunk of every page, including pages with no map.' +
      (report ? '' : '\nRe-run with --report to see the full import chain.')
  )
  process.exit(1)
}

console.log('✓ no forbidden packages reachable')
