---
name: Lazy User Dataset Loading
slug: lazy-user-dataset-loading
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.tsx
    hash: e1d925c7743fd0dd9e737449d39f377dfd38f9dfab2be6fca2002cc6b8ae5dc5
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
sources_digest: d2231789f5daf9872001323df2340cdff06204b3132083c96bbe25d16a7e2b9f
links:
  - to: dataset-state-management
    relation: uses
    description: Coordinates async dataset fetching with UI state transitions
  - to: layer-library-ui
    relation: configures
    description: >-
      Triggers dataset fetch and controls subcategory visibility based on load
      state
generator:
  version: 1
covers:
  - symbol: UserSubcategory
    kind: type
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L46-L46'
  - symbol: LayerLibrary
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L48-L416'
  - symbol: LayerLibraryUserPanel
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L41-L295
  - symbol: SectionComponent
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L115-L246
---

<!-- context:generated:start -->

## Summary

Layer library defers dataset fetching until the user navigates to the user panel, only for authenticated users. User dataset subcategories (tracks, polygons, points, gridded, bigQuery) are conditionally shown only after fetch completes, preventing UI flickering from partial loads and reducing initial bundle overhead.

## Related

- uses [[dataset-state-management]] — Coordinates async dataset fetching with UI state transitions
- configures [[layer-library-ui]] — Triggers dataset fetch and controls subcategory visibility based on load state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
