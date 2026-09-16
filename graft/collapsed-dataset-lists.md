---
name: Collapsed Dataset Lists
slug: collapsed-dataset-lists
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
sources_digest: 63bcf9997e8c578ceaa1eb0c7b67f3d1c38c97a48d5a58ba76c8a5016741eefa
links:
  - to: layer-library-ui
    relation: configures
    description: Applies collapse/expand behavior to user dataset lists
generator:
  version: 1
covers:
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

User panel collapses large geometry-type dataset groups beyond a threshold (COLLAPSED_DATASETS_COUNT) with expandable 'show more' buttons. Automatically expands all groups when search is active to surface matching datasets. Reduces initial visual clutter while maintaining discoverability.

## Related

- configures [[layer-library-ui]] — Applies collapse/expand behavior to user dataset lists

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
