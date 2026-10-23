/**
 * Writes the client chunk graph (which modules each chunk holds, which chunks it imports) to
 * dist/chunk-graph.json, for `load-boundaries.ts --mode build`.
 *
 * Sourcemaps would carry the module list too, but they are not reliably emitted, and they would
 * have to be served. dist/ is never served and is already a `build:app` output.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative } from 'node:path'
import type { Plugin } from 'vite'

import { CHUNK_GRAPH_FILE, REPO_ROOT } from './shared.ts'

export type ChunkGraph = {
  chunks: {
    file: string
    isEntry: boolean
    imports: string[]
    dynamicImports: string[]
    /** Repo-relative module id (query kept) and its rendered length in bytes. */
    modules: [string, number][]
  }[]
}

export function chunkGraph(): Plugin {
  return {
    name: 'chunk-graph',
    apply: 'build',
    applyToEnvironment: (environment) => environment.name === 'client',
    writeBundle(_options, bundle) {
      const graph: ChunkGraph = { chunks: [] }
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue
        graph.chunks.push({
          file: output.fileName,
          isEntry: output.isEntry,
          imports: output.imports,
          dynamicImports: output.dynamicImports,
          modules: Object.entries(output.modules).map(([id, info]) => [
            id.startsWith('/') ? relative(REPO_ROOT, id) : id,
            info.renderedLength,
          ]),
        })
      }
      mkdirSync(dirname(CHUNK_GRAPH_FILE), { recursive: true })
      writeFileSync(CHUNK_GRAPH_FILE, JSON.stringify(graph))
    },
  }
}
