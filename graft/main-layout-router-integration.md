---
name: Main Layout & Router Integration
slug: main-layout-router-integration
type: system
sources:
  - path: apps/track-labeler/src/features/main/main.container.ts
    hash: 87ed5caaeb911e19ada91a35b4cff64c08c678d65bf40078c608f548ca58b7c7
  - path: apps/track-labeler/src/features/main/Main.tsx
    hash: 3c391f3532469166b607ee1303f6c5e1f5fb4dc3c4a7b5181c694f0dcdf74130
sources_digest: 722b329615234cd359ff335c405a982686e1e5c22e1e28405bc31696a4a7d10f
links:
  - to: map-rendering-visualization-layer
    relation: uses
    description: Main composes Map component as primary geospatial display.
  - to: timebar-ui-data-filtering
    relation: uses
    description: Main composes Timebar component for temporal controls.
generator:
  version: 1
covers:
  - symbol: Main
    kind: function
    at: 'apps/track-labeler/src/features/main/Main.tsx:L8-L15'
---

<!-- context:generated:start -->

## Summary

Top-level layout component that composes the Map and Timebar features as the primary interface for the track-labeler application. Provides no internal state or business logic; relies on Redux for state management and child components for feature-specific logic. Router and authentication guards sit at or above this level.

## Related

- uses [[map-rendering-visualization-layer]] — Main composes Map component as primary geospatial display.
- uses [[timebar-ui-data-filtering]] — Main composes Timebar component for temporal controls.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
