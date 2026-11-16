/**
 * The *runtime* import graph of our source, resolved exactly as `tsc` resolves it for this app.
 *
 * Resolution is TypeScript's own (`ts.resolveModuleName` with apps/platform/tsconfig.json), so path
 * aliases and `exports` maps never need mirroring here. The app tsconfig sets
 * `customConditions: ["development"]`, which sends `@globalfishingwatch/*` to lib src, so the walk
 * crosses into our libs and a barrel cannot hide a heavy dependency. Real npm packages stop it: every
 * heavy dependency arrives through one of our modules, so the edge into the package is what matters.
 *
 * Deliberately not followed:
 *   - `import type` / type-only specifiers  (erased, cost nothing)
 *   - `import()`                            (separate chunk, that is the whole point)
 *   - css / image / font specifiers         (carry no JS; CSS *modules* do, and are followed)
 *
 * Known blind spots, by construction (build mode sees all three):
 *   - bundler chunking: Rolldown can put a module in a chunk that drags unrelated code onto a page
 *   - TanStack route splitting: a route file's component is split out, the walk counts it as eager
 *   - tree shaking: a `sideEffects: false` barrel costs less than the walk says
 */
import { readFileSync, statSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'

import ts from 'typescript'

import { APP_ROOT, carriesJs, CSS_MODULE, fromApp, packageNameOf } from './shared.ts'

export type Edge = {
  from: string
  spec: string
  /** Absolute file for our code, package name for npm, null when resolution failed. */
  to: string | null
  external: boolean
}

const tsconfig = ts.getParsedCommandLineOfConfigFile(fromApp('tsconfig.json'), undefined, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
    throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
  },
})!
const resolutionCache = ts.createModuleResolutionCache(APP_ROOT, (f) => f, tsconfig.options)

function resolveSpecifier(spec: string, from: string): Pick<Edge, 'to' | 'external'> {
  // tsc only knows CSS modules through an ambient `*.module.css` declaration, never as a file.
  if (CSS_MODULE.test(spec) && spec.startsWith('.')) {
    const file = resolve(dirname(from), spec)
    return { to: ts.sys.fileExists(file) ? file : null, external: false }
  }
  const { resolvedModule } = ts.resolveModuleName(
    spec,
    from,
    tsconfig.options,
    ts.sys,
    resolutionCache
  )
  if (!resolvedModule) return { to: null, external: false }
  let file = resolvedModule.resolvedFileName
  if (file.includes(`${sep}node_modules${sep}`)) return { to: packageNameOf(spec), external: true }
  // allowJs is off, so `./x.gen.js` resolves to its `.d.ts`. The bundler loads the `.js` next to it.
  if (file.endsWith('.d.ts')) {
    const js = file.replace(/\.d\.ts$/, '.js')
    if (!ts.sys.fileExists(js)) return { to: null, external: false }
    file = js
  }
  return { to: file, external: false }
}

/** Where a specifier lands when app code imports it. */
export const resolveFromApp = (spec: string) => resolveSpecifier(spec, fromApp('package.json'))

/** Runtime (non-type, non-dynamic) module specifiers of one file. */
function runtimeSpecifiers(file: string): string[] {
  if (file.endsWith('.json') || CSS_MODULE.test(file)) return []
  const kind = file.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : /\.m?js$/.test(file)
      ? ts.ScriptKind.JS
      : ts.ScriptKind.TS
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    false,
    kind
  )
  const specs: string[] = []
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause
      if (clause?.isTypeOnly) continue
      const named = clause?.namedBindings
      if (
        clause &&
        !clause.name &&
        named &&
        ts.isNamedImports(named) &&
        named.elements.length > 0 &&
        named.elements.every((el) => el.isTypeOnly)
      )
        continue
      if (ts.isStringLiteral(statement.moduleSpecifier)) specs.push(statement.moduleSpecifier.text)
    } else if (ts.isExportDeclaration(statement) && statement.moduleSpecifier) {
      if (statement.isTypeOnly) continue
      const clause = statement.exportClause
      if (
        clause &&
        ts.isNamedExports(clause) &&
        clause.elements.length > 0 &&
        clause.elements.every((el) => el.isTypeOnly)
      )
        continue
      if (ts.isStringLiteral(statement.moduleSpecifier)) specs.push(statement.moduleSpecifier.text)
    }
  }
  return specs
}

const edgeCache = new Map<string, Edge[]>()

/** Outgoing runtime edges of one file. Cached: every check walks the same shell again. */
export function edgesOf(file: string): Edge[] {
  let edges = edgeCache.get(file)
  if (!edges) {
    edges = runtimeSpecifiers(file)
      .filter(carriesJs)
      .map((spec) => ({ from: file, spec, ...resolveSpecifier(spec, file) }))
    edgeCache.set(file, edges)
  }
  return edges
}

export type SourceWalk = {
  files: Set<string>
  /** Every edge out of a reached file, including external and unresolved ones. */
  edges: Edge[]
  /** File -> the file BFS first reached it from. Gives one shortest chain per file. */
  parent: Map<string, string>
  /** npm package -> files importing it. */
  externals: Map<string, Set<string>>
  bytes: number
}

export function walkSource(entries: string[]): SourceWalk {
  const start = entries.map(fromApp)
  const files = new Set(start)
  const parent = new Map<string, string>()
  const externals = new Map<string, Set<string>>()
  const edges: Edge[] = []
  const queue = [...start]
  while (queue.length) {
    const file = queue.shift()!
    for (const edge of edgesOf(file)) {
      edges.push(edge)
      if (!edge.to) continue
      if (edge.external) {
        if (!externals.has(edge.to)) externals.set(edge.to, new Set())
        externals.get(edge.to)!.add(file)
        continue
      }
      if (files.has(edge.to)) continue
      files.add(edge.to)
      parent.set(edge.to, file)
      queue.push(edge.to)
    }
  }
  return { files, edges, parent, externals, bytes: bytesOf(files) }
}

export function bytesOf(files: Iterable<string>) {
  let bytes = 0
  for (const file of files) bytes += statSync(file).size
  return bytes
}

/** Entry-to-file import chain, entry first. */
export function chainTo(file: string, parent: Map<string, string>) {
  const chain = [file]
  for (let cursor = file; parent.has(cursor);) {
    cursor = parent.get(cursor)!
    chain.unshift(cursor)
  }
  return chain
}
