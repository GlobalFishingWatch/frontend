---
name: Guest User Isolation
slug: guest-user-isolation
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.tsx
    hash: e1d925c7743fd0dd9e737449d39f377dfd38f9dfab2be6fca2002cc6b8ae5dc5
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
  - path: apps/platform/features/_map/layer-library/LayerLibraryVesselGroupPanel.tsx
    hash: 27e978741fab4f63974088c58290e51e24a4240134567fcdf457b14be1822c5d
sources_digest: e9e95f638e1d25f27409a3ac32bad43a09e7d6323a5063cb507fdb32d226af16
links:
  - to: layer-library-ui
    relation: configures
    description: Filters layer visibility and UI features based on guest status
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
  - symbol: LayerLibraryVesselGroupPanel
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryVesselGroupPanel.tsx:L35-L167
---

<!-- context:generated:start -->

## Summary

Design pattern restricting functionality for unauthenticated users: layer library hides certain layers (marked guest-user or GFW-user-only), user panel displays login prompts instead of upload controls, and vessel group panel shows login links. Respects authentication state throughout the system without exposing authenticated data.

## Related

- configures [[layer-library-ui]] — Filters layer visibility and UI features based on guest status

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
