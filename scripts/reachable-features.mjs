#!/usr/bin/env node
/**
 * Which features/* dirs are reachable (runtime imports, type-only excluded) from a set of entries.
 *
 * Companion to check-store-graph.mjs: that one guards the store's graph against specific heavy
 * packages, this one answers "what does this entry actually pull in". Written to derive the
 * platform/ vs map/ load boundary from evidence, and it showed the boundary does not exist yet:
 *
 *   routes/__root.tsx + routes/index.tsx        ->  20 modules,   2 feature dirs
 *   + routes/_standalone.tsx and its children   -> 384 modules,  28 feature dirs
 *   routes/_map.tsx                             -> 343 modules,  28 feature dirs
 *   features/sidebar/Sidebar.tsx alone          -> 259 modules,  24 feature dirs
 *
 * i.e. Sidebar (rendered by BOTH shells) is what pulls features/map, features/timebar and
 * features/reports into the map-free shell.
 *
 * READ THIS BEFORE OPTIMISING: per-import weights DO NOT ADD UP. They overlap heavily, because almost
 * everything routes through the dataview/workspace selector hub
 * (app.selectors -> dataviews.instances.selectors -> area-reports.utils). Two measured examples:
 *   - moving AVAILABLE_WORKSPACES_CATEGORIES out of a 109-module selectors file into a 21-module leaf
 *     changed CategoryTabs' union by ZERO
 *   - removing both map hooks from CategoryTabs takes it 166 -> 139 and features/map is STILL reachable
 * So always measure the UNION for the entry you care about, never the sum of its imports. Until the
 * selector hub is split, no component reading workspace or dataview state can be map-free.
 *
 * Usage: node scripts/reachable-features.mjs routes/_map.tsx [more entries relative to apps/platform]
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

import ts from 'typescript'

const APP = resolve('apps/platform')
const PREFIX = [
  'assets',
  'data',
  'features',
  'hooks',
  'pages',
  'queries',
  'router',
  'routes',
  'server-functions',
  'server',
  'test',
  'types',
  'utils',
]
const EXACT = { middlewares: 1, queries: 1, reducers: 1, store: 1, types: 1 }
const EXT = ['.ts', '.tsx', '.mts', '.js', '.json']

const rf = (b) => {
  if (existsSync(b) && statSync(b).isFile()) return b
  for (const e of EXT) if (existsSync(b + e)) return b + e
  for (const e of EXT) {
    const i = resolve(b, 'index' + e)
    if (existsSync(i)) return i
  }
  return null
}
const resolveSpec = (spec, from) => {
  if (spec.startsWith('.')) return rf(resolve(dirname(from), spec))
  if (EXACT[spec]) return rf(resolve(APP, spec))
  for (const p of PREFIX) if (spec.startsWith(p + '/')) return rf(resolve(APP, spec))
  return null
}
const specs = (file) => {
  const src = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    false,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
  const out = []
  for (const st of src.statements) {
    if (ts.isImportDeclaration(st)) {
      const c = st.importClause
      if (c) {
        if (c.isTypeOnly) continue
        const b = c.namedBindings
        if (
          !c.name &&
          b &&
          ts.isNamedImports(b) &&
          b.elements.length &&
          b.elements.every((e) => e.isTypeOnly)
        )
          continue
      }
      if (ts.isStringLiteral(st.moduleSpecifier)) out.push(st.moduleSpecifier.text)
    } else if (ts.isExportDeclaration(st) && st.moduleSpecifier) {
      if (st.isTypeOnly) continue
      const c = st.exportClause
      if (c && ts.isNamedExports(c) && c.elements.length && c.elements.every((e) => e.isTypeOnly))
        continue
      if (ts.isStringLiteral(st.moduleSpecifier)) out.push(st.moduleSpecifier.text)
    }
  }
  return out
}

const entries = process.argv.slice(2).map((f) => resolve(APP, f))
const seen = new Set(entries),
  q = [...entries]
while (q.length) {
  const f = q.shift()
  let ss
  try {
    ss = specs(f)
  } catch {
    continue
  }
  for (const s of ss) {
    const t = resolveSpec(s, f)
    if (t && !seen.has(t)) {
      seen.add(t)
      q.push(t)
    }
  }
}
const dirs = new Set()
for (const f of seen) {
  const r = relative(APP, f)
  if (r.startsWith('features/')) dirs.add(r.split('/')[1])
}
console.log(`entries: ${process.argv.slice(2).join(', ')}`)
console.log(`modules: ${seen.size}`)
console.log(`features dirs reachable (${dirs.size}):\n  ${[...dirs].sort().join(' ')}`)
