/**
 * Dependency-free constants, exposed at `@globalfishingwatch/deck-layer-composer/constants`.
 *
 * Reaching these through the package root costs every consumer the whole composer graph —
 * @deck.gl/core, deck-layers, deck-loaders, react and jotai — for one string. Keep this module
 * import-free so the subpath stays a leaf.
 */

/** Suffix of the auxiliary deck layer a fourwings dataview spawns (e.g. `ais-auxiliar`) */
export const AUXILIAR_DATAVIEW_SUFIX = 'auxiliar'
