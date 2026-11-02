#!/usr/bin/env node
/**
 * Guards what each page loads. Rules live in config.ts; this file walks a graph and reports.
 *
 * Two graph sources, same rules:
 *   --mode source  (default) our import graph, resolved like tsc. ~1s, needs no build. The CI gate:
 *                  forbidden code, root-barrel imports and module budgets fail it.
 *   --mode build   the real client chunk graph from the last `nx run platform:build:app`. Sees what
 *                  source cannot: Rolldown chunking, TanStack route splitting, tree shaking, real
 *                  gzip bytes. Report only, never fails: a hit here is explained with source mode.
 *
 * Commands (run from the repo root):
 *   node apps/platform/scripts/load-boundaries/load-boundaries.ts check [--only <text>] [--json] [--markdown <file>]
 *   node apps/platform/scripts/load-boundaries/load-boundaries.ts explain <entry...> [--baseline <entry>]
 *   node apps/platform/scripts/load-boundaries/load-boundaries.ts why <package|path> [--from <entry>]
 * Every command takes --mode source|build. Entries are relative to apps/platform.
 */
import { existsSync, writeFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

import type { BuildWalk } from './build-graph.ts'
import { chunkInfo, chunksHolding, walkBuild } from './build-graph.ts'
import { CHECKS, MAP_DEPENDENT_ROUTES } from './config.ts'
import type { Check, Forbid } from './shared.ts'
import {
  APP_PACKAGE,
  appRelative,
  forbiddenReason,
  fromApp,
  isAppFile,
  libKey,
  matchesPackage,
  packageNameOf,
  packageOf,
  repoRelative,
} from './shared.ts'
import type { SourceWalk } from './source-graph.ts'
import { bytesOf, chainTo, resolveFromApp, walkSource } from './source-graph.ts'

type Mode = 'source' | 'build'

type Result = {
  label: string
  mode: Mode
  baseline?: string[]
  /** Source: modules reached. Build: chunks reached. */
  count: number
  maxModules?: number
  /** Source: file bytes. Build: gzip bytes. */
  bytes: number
  added?: { count: number; bytes: number }
  /** Every forbidden module or package reached, collapsed to package name where one matched. */
  forbidden: string[]
  /** Source: edges from allowed code into forbidden code. Build: chunk chain to a forbidden module. */
  cuts: { from: string; to: string }[]
  barrels: { from: string; spec: string }[]
  /** Config problems: entries that do not exist, or that the build does not contain. */
  errors: string[]
  why: string
}

const show = (file: string) => (isAppFile(file) ? appRelative(file) : repoRelative(file))
const kb = (bytes: number) => `${Math.round(bytes / 1024).toLocaleString('en')} KB`

/** Forbidden-target name: the package when a package rule matched, the file otherwise. */
const targetName = (file: string, reason: string) =>
  reason === packageOf(file) ? reason : show(file)

const exemptions = new Map<Forbid, { keys: Set<string>; errors: string[] }>()

/** libKeys of every module an allowed subpath reaches inside its own package. */
function exemptFor(forbid: Forbid) {
  if (!exemptions.has(forbid)) {
    const keys = new Set<string>()
    const errors: string[] = []
    for (const spec of forbid.allowSubpaths ?? []) {
      const { to, external } = resolveFromApp(spec)
      if (!to || external) {
        errors.push(`allowSubpaths: ${spec} does not resolve to workspace source`)
        continue
      }
      for (const file of walkSource([to]).files) {
        if (packageOf(file) === packageNameOf(spec)) keys.add(libKey(file))
      }
    }
    exemptions.set(forbid, { keys, errors })
  }
  return exemptions.get(forbid)!
}

function configErrors(check: Check) {
  return [
    ...[...check.entries, ...(check.baseline ?? []), ...(check.forbid.allow ?? [])]
      .filter((file) => !existsSync(fromApp(file)))
      .map((file) => `${file} does not exist`),
    ...exemptFor(check.forbid).errors,
  ]
}

// ---- source mode --------------------------------------------------------------------------------

const sourceWalks = new Map<string, SourceWalk>()
const sourceWalk = (entries: string[]) => {
  const key = entries.join('\n')
  if (!sourceWalks.has(key)) sourceWalks.set(key, walkSource(entries))
  return sourceWalks.get(key)!
}

/** Allowlist entries some check really used. Anything else on an allowlist is stale. */
const allowUsed = new Set<string>()

function checkSource(check: Check): Result {
  const errors = configErrors(check)
  const empty = { forbidden: [], cuts: [], barrels: [], count: 0, bytes: 0 }
  if (errors.length) return { ...empty, label: check.label, mode: 'source', errors, why: check.why }

  const walk = sourceWalk(check.entries)
  const base = check.baseline ? sourceWalk(check.baseline) : undefined
  const own = (file: string) => !base?.files.has(file)
  const exempt = exemptFor(check.forbid).keys

  const forbiddenFiles = new Map<string, string>()
  for (const file of walk.files) {
    if (!own(file)) continue
    if (check.forbid.allow?.includes(appRelative(file))) allowUsed.add(appRelative(file))
    const reason = forbiddenReason(file, check.forbid, exempt)
    if (reason) forbiddenFiles.set(file, targetName(file, reason))
  }
  const forbidden = new Set(forbiddenFiles.values())
  for (const name of walk.externals.keys()) {
    if (matchesPackage(name, check.forbid.packages) && !base?.externals.has(name))
      forbidden.add(name)
  }

  const cuts: Result['cuts'] = []
  const barrels: Result['barrels'] = []
  for (const edge of walk.edges) {
    if (!own(edge.from) || forbiddenFiles.has(edge.from) || !edge.to) continue
    if (check.forbid.allowSubpaths?.includes(edge.spec)) allowUsed.add(edge.spec)
    if (check.forbid.barrels?.includes(edge.spec)) {
      barrels.push({ from: show(edge.from), spec: edge.spec })
    }
    const to = edge.external ? forbidden.has(edge.to) && edge.to : forbiddenFiles.get(edge.to)
    if (to) cuts.push({ from: show(edge.from), to })
  }

  const ownFiles = [...walk.files].filter(own)
  return {
    label: check.label,
    mode: 'source',
    baseline: check.baseline,
    count: walk.files.size,
    maxModules: check.maxModules,
    bytes: walk.bytes,
    added: base && { count: ownFiles.length, bytes: bytesOf(ownFiles) },
    forbidden: [...forbidden].sort(),
    cuts,
    barrels,
    errors,
    why: check.why,
  }
}

// ---- build mode ---------------------------------------------------------------------------------

const buildWalks = new Map<string, BuildWalk>()
const buildWalk = (entries: string[]) => {
  const key = entries.join('\n')
  if (!buildWalks.has(key)) buildWalks.set(key, walkBuild(entries))
  return buildWalks.get(key)!
}

/** Rolldown names shared chunks after every entry that needs them; keep the head and the hash. */
const chunkName = (file: string) => {
  const name = file.replace(/^assets\//, '')
  return name.length > 48 ? `${name.slice(0, 32)}…${name.slice(name.lastIndexOf('-'))}` : name
}

const chunkChain = (chunk: string, walk: BuildWalk) => {
  const chain = chainTo(chunk, walk.parent).map(chunkName)
  return (chain.length > 3 ? [chain[0], '…', ...chain.slice(-2)] : chain).join(' → ')
}

function checkBuild(check: Check): Result {
  const walk = buildWalk(check.entries)
  const base = check.baseline ? buildWalk(check.baseline) : undefined
  const errors = [...configErrors(check), ...walk.missing.map((e) => `${e} is in no chunk`)]
  const exempt = exemptFor(check.forbid).keys

  const forbidden = new Set<string>()
  const cuts = new Map<string, { from: string; to: string }>()
  for (const module of walk.modules) {
    if (base?.modules.has(module)) continue
    const reason = forbiddenReason(module, check.forbid, exempt)
    if (!reason) continue
    const to = targetName(module, reason)
    forbidden.add(to)
    for (const chunk of chunksHolding(module, walk)) {
      const from = chunkChain(chunk, walk)
      cuts.set(`${from}\n${to}`, { from, to })
    }
  }

  const newChunks = [...walk.chunks].filter((chunk) => !base?.chunks.has(chunk))
  return {
    label: check.label,
    mode: 'build',
    baseline: check.baseline,
    count: walk.chunks.size,
    bytes: walk.gzip,
    added: base && {
      count: newChunks.length,
      bytes: newChunks.reduce((sum, chunk) => sum + chunkInfo(chunk).gzip, 0),
    },
    forbidden: [...forbidden].sort(),
    cuts: [...cuts.values()],
    barrels: [],
    errors,
    why: check.why,
  }
}

// ---- output -------------------------------------------------------------------------------------

const overBudget = (r: Result) => r.maxModules !== undefined && r.count > r.maxModules
const failed = (r: Result) =>
  r.errors.length > 0 || r.forbidden.length > 0 || r.barrels.length > 0 || overBudget(r)

function summaryLine(r: Result) {
  const unit = r.mode === 'source' ? 'modules' : 'chunks'
  const budget = r.maxModules === undefined ? '' : ` / ${r.maxModules}`
  const size = r.mode === 'source' ? `${kb(r.bytes)} source` : `${kb(r.bytes)} gzip`
  const added = r.added
    ? `, +${r.added.count} ${unit}${r.mode === 'build' ? ` (${kb(r.added.bytes)})` : ''} beyond ${r.baseline!.join(', ')}`
    : ''
  return `${r.count} ${unit}${budget} · ${size}${added}`
}

function printText(results: Result[]) {
  for (const r of results) {
    console.log(`${failed(r) ? '✗' : '✓'} ${r.label}  ${summaryLine(r)}`)
    for (const error of r.errors) console.log(`    config: ${error}`)
    if (r.forbidden.length) {
      const shown = r.forbidden.slice(0, 8).join(', ')
      const more = r.forbidden.length > 8 ? ` (+${r.forbidden.length - 8} more)` : ''
      console.log(`    forbidden: ${shown}${more}`)
      console.log(r.mode === 'source' ? '    edges to cut:' : '    chunk chains:')
      for (const cut of r.cuts) console.log(`      ${cut.from} -> ${cut.to}`)
    }
    if (r.barrels.length) {
      console.log('    root-barrel imports (use a leaf subpath):')
      for (const b of r.barrels) console.log(`      ${b.from} -> '${b.spec}'`)
    }
    if (overBudget(r)) {
      console.log(
        `    over budget by ${r.count - r.maxModules!}. Nothing forbidden, the graph just grew.`
      )
      console.log(
        '    Not needed eagerly: put it behind import() or a leaf subpath (`explain` lists barrels).'
      )
      console.log(
        '    Intended: raise maxModules in config.ts and say why in the commit. Budgets only go down.'
      )
    }
    if (failed(r) && r.mode === 'source') console.log(`    why: ${r.why}`)
  }
  const failures = results.filter(failed).length
  console.log(
    failures
      ? `\n${failures} of ${results.length} checks failed. \`why <target>\` lists every importer.`
      : `\nall ${results.length} checks pass`
  )
}

function markdown(results: Result[]) {
  const mode = results[0]?.mode ?? 'source'
  const unit = mode === 'source' ? 'Modules' : 'Chunks'
  const lines = [
    `### Load boundaries (${mode} mode)`,
    '',
    `| | Check | ${unit} | ${mode === 'source' ? 'Source' : 'Gzip'} | Beyond baseline | Forbidden |`,
    '|---|---|---|---|---|---|',
    ...results.map((r) => {
      const count = r.maxModules === undefined ? `${r.count}` : `${r.count} / ${r.maxModules}`
      const added = r.added
        ? `+${r.added.count}${mode === 'build' ? ` (${kb(r.added.bytes)})` : ''}`
        : ''
      return `| ${failed(r) ? '✗' : '✓'} | \`${r.label}\` | ${count} | ${kb(r.bytes)} | ${added} | ${r.forbidden.join(', ')} |`
    }),
  ]
  for (const r of results.filter((r) => r.cuts.length || r.barrels.length || r.errors.length)) {
    lines.push('', `<details><summary><code>${r.label}</code></summary>`, '', '```')
    for (const e of r.errors) lines.push(`config: ${e}`)
    for (const c of r.cuts) lines.push(`${c.from} -> ${c.to}`)
    for (const b of r.barrels) lines.push(`${b.from} -> '${b.spec}'`)
    lines.push('```', '</details>')
  }
  return lines.join('\n') + '\n'
}

// ---- commands -----------------------------------------------------------------------------------

function check(mode: Mode, only: string | undefined) {
  const checks = only ? CHECKS.filter((c) => c.label.includes(only)) : CHECKS
  if (!checks.length) throw new Error(`no check label contains "${only}"`)
  const results = checks.map(mode === 'source' ? checkSource : checkBuild)

  // Stale-config checks need every check to have run.
  if (mode === 'source' && !only) {
    const allowlisted = CHECKS.flatMap((c) => [
      ...(c.forbid.allow ?? []),
      ...(c.forbid.allowSubpaths ?? []),
    ])
    const stale = [...new Set(allowlisted)].filter((entry) => !allowUsed.has(entry))
    const missingRoutes = MAP_DEPENDENT_ROUTES.filter((route) => !existsSync(fromApp(route)))
    if (stale.length || missingRoutes.length) {
      results.push({
        label: 'config.ts',
        mode,
        count: 0,
        bytes: 0,
        forbidden: [],
        cuts: [],
        barrels: [],
        errors: [
          ...stale.map((e) => `${e} is allowlisted but no checked page uses it; delete it`),
          ...missingRoutes.map((r) => `${r} is in MAP_DEPENDENT_ROUTES but does not exist`),
        ],
        why: 'Stale config hides real changes.',
      })
    }
  }
  return results
}

function explain(mode: Mode, entries: string[], baseline: string[] | undefined) {
  if (mode === 'build') {
    const walk = walkBuild(entries)
    const base = baseline && walkBuild(baseline)
    for (const e of walk.missing) console.log(`! ${e} is in no chunk`)
    console.log(`${walk.chunks.size} chunks · ${kb(walk.gzip)} gzip · ${kb(walk.raw)} raw\n`)
    const rows = [...walk.chunks].map(chunkInfo).sort((a, b) => b.gzip - a.gzip)
    for (const chunk of rows) {
      const isNew = base && !base.chunks.has(chunk.file)
      console.log(
        `${isNew ? '+' : ' '} ${kb(chunk.gzip).padStart(8)}  ${String(chunk.modules.length).padStart(4)} modules  ${chunk.file}`
      )
      if (!isNew) continue
      const largest = [...chunk.modules].sort((a, b) => b[1] - a[1]).slice(0, 3)
      for (const [id, length] of largest)
        console.log(`             ${kb(length).padStart(8)}  ${id}`)
    }
    if (base) console.log('\n+ = not loaded by the baseline; its three largest modules listed')
    return
  }

  const walk = walkSource(entries)
  const base = baseline && walkSource(baseline)
  const files = [...walk.files].filter((f) => !base || !base.files.has(f))
  console.log(
    `${walk.files.size} modules · ${kb(walk.bytes)} source · ${walk.externals.size} npm packages` +
      (base ? ` · ${files.length} beyond ${baseline.join(', ')}` : '')
  )

  // Where the modules come from: feature folder for app code, package for everything else.
  const areas = new Map<string, number>()
  for (const file of files) {
    const pkg = packageOf(file)
    const area =
      pkg === APP_PACKAGE ? appRelative(file).split('/').slice(0, 2).join('/') : (pkg ?? show(file))
    areas.set(area, (areas.get(area) ?? 0) + 1)
  }
  console.log('\nmodules by area:')
  for (const [area, n] of [...areas].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${area}`)
  }

  // Cost per workspace specifier, from a sub-walk: `ui-components/icon` and `ui-components` are
  // very different imports of one package.
  const specifiers = new Map<string, string>()
  for (const edge of walk.edges) {
    if (edge.to && !edge.external && !/^[./]/.test(edge.spec) && packageOf(edge.to) !== APP_PACKAGE)
      specifiers.set(edge.spec, edge.to)
  }
  console.log('\nworkspace specifiers (modules each one pulls on its own):')
  const rows = [...specifiers].map(([spec, file]) => [spec, walkSource([file]).files.size] as const)
  for (const [spec, n] of rows.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`  ${String(n).padStart(4)}  ${spec}`)
  }

  console.log('\nnpm packages (not walked):')
  for (const [name, importers] of [...walk.externals].sort()) {
    console.log(`  ${name}  (${importers.size} importer${importers.size === 1 ? '' : 's'})`)
  }

  const unresolved = walk.edges.filter((e) => !e.to)
  if (unresolved.length) {
    console.log('\nunresolved specifiers:')
    for (const e of unresolved) console.log(`  ${show(e.from)} -> ${e.spec}`)
  }
  if (base) {
    console.log(`\nmodules beyond ${baseline.join(', ')}:`)
    for (const file of files.map(show).sort()) console.log(`  ${file}`)
  }
}

function why(mode: Mode, needle: string, from: string[]) {
  const matches = (file: string) => packageOf(file) === needle || show(file).includes(needle)

  if (mode === 'build') {
    const walk = walkBuild(from)
    const hits = [...walk.modules].filter(matches)
    if (!hits.length) return console.log(`"${needle}" is in no chunk these entries load`)
    const chunks = new Set(hits.flatMap((m) => chunksHolding(m, walk)))
    for (const chunk of chunks) {
      console.log(`\n${chunk}  (${chunkInfo(chunk).modules.length} modules)`)
      console.log(`  loaded via: ${chainTo(chunk, walk.parent).map(chunkName).join(' → ')}`)
      for (const m of hits.filter((h) => chunksHolding(h, walk).includes(chunk))) {
        console.log(`  holds ${show(m)}`)
      }
    }
    return
  }

  const walk = walkSource(from)
  const importers = new Map<string, Set<string>>()
  for (const edge of walk.edges) {
    if (!edge.to) continue
    const hit = edge.external ? edge.to === needle : matches(edge.to)
    if (!hit) continue
    const key = edge.external ? edge.to : show(edge.to)
    if (!importers.has(key)) importers.set(key, new Set())
    importers.get(key)!.add(edge.from)
  }
  if (!importers.size) return console.log(`"${needle}" is not reachable from ${from.join(', ')}`)
  for (const [target, files] of importers) {
    console.log(`\n${target}  <- ${files.size} importer(s)`)
    for (const file of [...files].map(show).sort()) console.log(`  ${file}`)
    const first = [...files][0]
    console.log(`  shortest chain: ${chainTo(first, walk.parent).map(show).join(' → ')}`)
  }
}

// ---- main ---------------------------------------------------------------------------------------

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    mode: { type: 'string', default: 'source' },
    only: { type: 'string' },
    json: { type: 'boolean', default: false },
    markdown: { type: 'string' },
    baseline: { type: 'string', multiple: true },
    from: { type: 'string', multiple: true },
    help: { type: 'boolean', short: 'h', default: false },
  },
})
const [command = 'check', ...args] = positionals
const mode = values.mode as Mode
if (values.help || !['source', 'build'].includes(mode)) {
  console.log(
    'usage: load-boundaries.ts [check|explain <entry...>|why <package|path>] [--mode source|build]\n' +
      '  check    --only <text>  --json  --markdown <file>\n' +
      '  explain  --baseline <entry>\n' +
      '  why      --from <entry>   (default: every checked entry)'
  )
  process.exit(values.help ? 0 : 1)
}

if (command === 'check') {
  const results = check(mode, values.only)
  if (values.json) console.log(JSON.stringify(results, null, 2))
  else printText(results)
  if (values.markdown) writeFileSync(values.markdown, markdown(results))
  // Build mode reports, it never gates: its findings are explained, and fixed, with source mode.
  if (mode === 'source' && results.some(failed)) process.exit(1)
} else if (command === 'explain' && args.length) {
  explain(mode, args, values.baseline)
} else if (command === 'why' && args.length === 1) {
  why(mode, args[0], values.from ?? [...new Set(CHECKS.flatMap((c) => c.entries))])
} else {
  console.error(`unknown command or missing argument: ${positionals.join(' ')}  (try --help)`)
  process.exit(1)
}
