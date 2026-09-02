/**
 * Enums, constants and static config only, avoiding runtime deck.gl / @luma.gl / simple-statistics imports.
 */
export * from './colorRamps.config'
// named, not `export *` — the rest of layers.config is internal (env/path helpers)
export { PICK_ONLY_LAYER_ID_SUFFIX } from './layers.config'
export * from './colors.config'
export * from './sort.config'
export * from '../layers/basemap/basemap.types'
export * from '../layers/fourwings/fourwings.config'
export * from '../layers/fourwings/heatmap/fourwings-heatmap.types'
export * from '../layers/vessel/vessel.config'
