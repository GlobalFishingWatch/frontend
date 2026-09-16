---
name: Search Query Constraints
slug: search-query-constraints
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.tsx
    hash: e1d925c7743fd0dd9e737449d39f377dfd38f9dfab2be6fca2002cc6b8ae5dc5
sources_digest: 7476715d35785076aee0e39f72fda2595c27d8d67199ddbd3d9c2c21febc92df
links:
  - to: layer-library-ui
    relation: configures
    description: Applies minimum query length and empty category hiding logic
generator:
  version: 1
covers:
  - symbol: UserSubcategory
    kind: type
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L46-L46'
  - symbol: LayerLibrary
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L48-L416'
---

<!-- context:generated:start -->

## Summary

Layer library enforces a three-character minimum for search queries before filtering activates, preventing excessive filtering on partial input and reducing unnecessary re-renders. Dynamically hides categories that become empty after filtering, simplifying the navigation sidebar.

## Related

- configures [[layer-library-ui]] — Applies minimum query length and empty category hiding logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
