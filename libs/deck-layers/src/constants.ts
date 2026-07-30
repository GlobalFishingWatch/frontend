/**
 * Leaf entry point: enums, constants and pure config that consumers need as *values* without paying for
 * deck.gl.
 *
 * Apps put these in URL schemas, redux slices and dataview defaults — code that ends up in the entry
 * chunk of every page. Importing them from the package root pulls all of deck.gl in with them.
 *
 * Everything re-exported here must stay free of runtime deck.gl / @luma.gl / simple-statistics imports.
 * apps/platform enforces that: scripts/check-store-graph.mjs resolves this module and walks its imports,
 * so a heavy addition fails that check rather than silently regressing bundle size.
 */
export * from './layers/basemap/basemap.types'
export * from './layers/fourwings/fourwings.config'
export * from './layers/fourwings/heatmap/fourwings-heatmap.types'
export * from './layers/vessel/vessel.config'
export * from './utils/colorRamps'
export * from './utils/sort'
