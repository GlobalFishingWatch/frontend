---
name: Track-Labeler Configuration & Schema
slug: track-labeler-configuration-schema
type: system
sources:
  - path: apps/track-labeler/src/data/config.ts
    hash: 0408cec6d2a0eae75e7e5d280a285d3f9678e36478e2e6fb088b2f8c70584a81
  - path: apps/track-labeler/src/data/constants.ts
    hash: a1f51389c6cddb5058c44e6c4c0763470d44fabe2e2d67503216bdbca2e99731
  - path: apps/track-labeler/src/data/models.ts
    hash: dc67e2eba815e8440799f15bfb6d71199d36f308d6b1cab88328edbddf32a48b
  - path: apps/track-labeler/src/data/projects.ts
    hash: 907de75607aba93e3db150275262af4b0015809223357b90b737dd56aba5acdd
sources_digest: e32df85488d14e48c706868fc5fba1a531066d4e67140c643ed48fa7d42a142d
links:
  - to: track-labeler-interactive-vessel-track-labeling
    relation: configures
    description: >-
      Configuration constants initialize app state, viewport, and available
      labeling projects
generator:
  version: 1
covers:
  - symbol: ContextualLayerIds
    kind: type
    at: 'apps/track-labeler/src/data/config.ts:L41-L41'
  - symbol: ContextualLayerTypes
    kind: type
    at: 'apps/track-labeler/src/data/config.ts:L42-L50'
  - symbol: TimebarMode
    kind: enum
    at: 'apps/track-labeler/src/data/config.ts:L59-L63'
  - symbol: Field
    kind: enum
    at: 'apps/track-labeler/src/data/models.ts:L1-L13'
  - symbol: Project
    kind: type
    at: 'apps/track-labeler/src/data/projects.ts:L6-L17'
---

<!-- context:generated:start -->

## Summary

Defines project configurations, labeling schemas, and application-wide constants for track-labeler. PROJECTS hardcodes four maritime activity classification tasks (Sand Dredger, Trawler, Longline variants) with associated datasets, label definitions with display colors, and configurable filters/display_options from Field enum. TRACK_FIELDS specifies vessel position attributes (speed, elevation, etc.); DEFAULT_WORKSPACE sets initial map bounds, speed filters, layer visibility, and time range. BASE_URL routes to /tracks-labeler in production or root in dev; UNDO_HOTKEYS and LABEL_HOTKEYS provide keyboard shortcuts.

## Related

- configures [[track-labeler-interactive-vessel-track-labeling]] — Configuration constants initialize app state, viewport, and available labeling projects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
