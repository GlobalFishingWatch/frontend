/**
 * The chunk graph of the real client build: what a page downloads, after Rolldown has grouped,
 * merged and tree-shaken modules. Reads dist/chunk-graph.json (chunk-graph.plugin.ts) and the
 * emitted files for sizes.
 *
 * A page loads the client entry chunk plus every chunk holding one of its route modules, and then
 * everything those import statically. TanStack splits a route into `route.tsx?tsr-split=…` modules;
 * the query is dropped, so all parts of a route count as the route.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

import type { ChunkGraph } from './chunk-graph.plugin.ts'
import { carriesJs, CHUNK_GRAPH_FILE, CLIENT_OUTPUT_DIR, fromApp, REPO_ROOT } from './shared.ts'

type Chunk = ChunkGraph['chunks'][number] & { raw: number; gzip: number }

export type BuildWalk = {
  chunks: Set<string>
  /** Absolute module paths. Virtual modules are left out. */
  modules: Set<string>
  /** Chunk -> the chunk BFS first reached it from. */
  parent: Map<string, string>
  /** Entries no chunk holds: stale config, or the module was tree-shaken away. */
  missing: string[]
  raw: number
  gzip: number
}

let loaded: { chunks: Map<string, Chunk>; chunksOf: Map<string, string[]> } | undefined

/**
 * Module id -> absolute path, or null for virtual modules (`\0…`, `virtual:…`) and plain CSS, which
 * `cssCodeSplit: false` moves into the one global stylesheet whatever chunk lists it.
 */
function modulePath(id: string) {
  const path = id.replace(/\?.*$/, '')
  if (path.startsWith('\0') || path.includes(':') || !carriesJs(path)) return null
  return resolve(REPO_ROOT, path)
}

function load() {
  if (loaded) return loaded
  if (!existsSync(CHUNK_GRAPH_FILE)) {
    throw new Error(`${CHUNK_GRAPH_FILE} not found. Build first: pnpm nx run platform:build:app`)
  }
  const graph: ChunkGraph = JSON.parse(readFileSync(CHUNK_GRAPH_FILE, 'utf8'))
  const chunks = new Map<string, Chunk>()
  const chunksOf = new Map<string, string[]>()
  for (const chunk of graph.chunks) {
    const file = resolve(CLIENT_OUTPUT_DIR, chunk.file)
    const raw = statSync(file).size
    // nitro's compressPublicAssets writes the .gz next to each file; compress ourselves if it did not.
    const gzip = existsSync(`${file}.gz`)
      ? statSync(`${file}.gz`).size
      : gzipSync(readFileSync(file)).length
    chunks.set(chunk.file, { ...chunk, raw, gzip })
    for (const [id] of chunk.modules) {
      const path = modulePath(id)
      if (!path) continue
      if (!chunksOf.has(path)) chunksOf.set(path, [])
      chunksOf.get(path)!.push(chunk.file)
    }
  }
  loaded = { chunks, chunksOf }
  return loaded
}

export function chunkInfo(file: string) {
  return load().chunks.get(file)!
}

export function walkBuild(entries: string[]): BuildWalk {
  const { chunks, chunksOf } = load()
  const missing = entries.filter((entry) => !chunksOf.has(fromApp(entry)))
  const start = [
    ...[...chunks.values()].filter((chunk) => chunk.isEntry).map((chunk) => chunk.file),
    ...entries.flatMap((entry) => chunksOf.get(fromApp(entry)) ?? []),
  ]
  const reached = new Set(start)
  const parent = new Map<string, string>()
  const queue = [...reached]
  while (queue.length) {
    const file = queue.shift()!
    for (const next of chunks.get(file)!.imports) {
      if (reached.has(next)) continue
      reached.add(next)
      parent.set(next, file)
      queue.push(next)
    }
  }
  const modules = new Set<string>()
  let raw = 0
  let gzip = 0
  for (const file of reached) {
    const chunk = chunks.get(file)!
    raw += chunk.raw
    gzip += chunk.gzip
    for (const [id] of chunk.modules) {
      const path = modulePath(id)
      if (path) modules.add(path)
    }
  }
  return { chunks: reached, modules, parent, missing, raw, gzip }
}

/** Chunks holding `file`, among those a walk reached. */
export function chunksHolding(file: string, walk: BuildWalk) {
  return (load().chunksOf.get(file) ?? []).filter((chunk) => walk.chunks.has(chunk))
}
