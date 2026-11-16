---
name: tile-layer-render-sublayers-triggers
description: TileLayer caches sublayers per tile and ignores renderSubLayers changes; every value it closes over must be in updateTriggers.renderSubLayers
---

# TileLayer only rebuilds sublayers when `updateTriggers.renderSubLayers` changes

deck.gl compares function props only when declared `compare: true`, and `TileLayer` declares
`renderSubLayers` as a plain `{ type: 'function' }`
(`@deck.gl/core/dist/lifecycle/prop-types.js`, `function.equal`). A new closure with new
colors or filters is therefore **not** a change. Each tile keeps its cached `tile.layers` until
`propsOrDataChanged` or `updateTriggersChanged` sets them to `null` in `TileLayer.updateState`.

**Why:** `ContextLayer` set `updateTriggers: { renderSubLayers: [highlightedFeaturesHash] }` on
2026-09-11 (`e74b3b9347`). From then on, changing an RFMO filter, color or thickness did
nothing until the next hover changed the highlight hash and the tiles happened to rebuild. It
looked like a dataview/URL bug. Found 2026-10-21.

**How to apply:** when a `renderSubLayers` closure reads a value from props (sublayer color,
thickness, filters, filter operators, highlight state), add that value, or a hash of it, to
`updateTriggers.renderSubLayers` on the TileLayer. `ContextLayer` builds a per-layer
`sublayersHash` for this. Putting the hash in a sublayer's `id` does not help on its own,
because the sublayers are never regenerated to pick up the new id.

Related: tile data handed to sublayers must keep a stable reference across those rebuilds. A
fresh filtered array makes deck re-tessellate every polygon on each hover.
`filterHiddenFeatures` in `context.utils.ts` caches its result per tile in a `WeakMap` for this
reason.
