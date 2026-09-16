---
name: Query-Driven State Synchronization
slug: query-driven-state-synchronization
type: concept
sources:
  - path: apps/track-labeler/src/routes/routes.middlewares.ts
    hash: 3a49439224fa6fcd1da5bba2a921397c1332176a34bfd3f44a6d640bc692d864
  - path: apps/track-labeler/src/routes/routes.selectors.ts
    hash: e67b5eafc2aeae134265ca2925a8193bfd69bbac2e647535a2caefb10b97b177
  - path: apps/track-labeler/src/routes/routes.ts
    hash: 99aef2727ce1f68d052f8e8d1b07cc36d1df640c267c7d296aced0f7799c377a
  - path: apps/track-labeler/src/types/index.ts
    hash: e4bec0d7db2784f42e8a02231801280a31e0955f54d3c04339f19881e28b242b
sources_digest: 00fe8f7be5fa137f07dd255bb2e9c3a491796c5cbdf135e6c1136354ea678293
links:
  - to: track-labeler-routing
    relation: part_of
    description: >-
      Routes system implements query encoding/decoding and middleware
      synchronization
  - to: workspace-and-project-configuration
    relation: uses
    description: >-
      Query parameters encode startDate, endDate, filteredSpeed,
      filteredElevation, and other workspace filters that control project
      display
generator:
  version: 1
covers:
  - symbol: routerQueryMiddleware
    kind: function
    at: 'apps/track-labeler/src/routes/routes.middlewares.ts:L10-L31'
  - symbol: routerRefreshTokenMiddleware
    kind: function
    at: 'apps/track-labeler/src/routes/routes.middlewares.ts:L33-L50'
  - symbol: selectLocation
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L11-L13'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L22-L28'
  - symbol: thunk
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L21-L45'
  - symbol: encodeWorkspace
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L77-L79'
  - symbol: decodeWorkspace
    kind: function
    at: 'apps/track-labeler/src/routes/routes.ts:L81-L92'
  - symbol: WorkspaceParam
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L3-L26'
  - symbol: QueryParams
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L27-L29'
  - symbol: CoordinatePosition
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L31-L34'
  - symbol: MapCoordinates
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L36-L41'
  - symbol: VesselPoint
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L43-L60'
  - symbol: ActionType
    kind: enum
    at: 'apps/track-labeler/src/types/index.ts:L62-L82'
  - symbol: TrackColor
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L84-L86'
  - symbol: LayersData
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L118-L121'
  - symbol: DayNightLayer
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L123-L127'
  - symbol: ArrowFeature
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L129-L141'
  - symbol: VesselDirectionsGeneratorConfig
    kind: interface
    at: 'apps/track-labeler/src/types/index.ts:L143-L149'
  - symbol: ExportFeature
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L151-L167'
  - symbol: Label
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L169-L173'
  - symbol: ExportData
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L175-L191'
  - symbol: FilterModeValues
    kind: type
    at: 'apps/track-labeler/src/types/index.ts:L193-L195'
---

<!-- context:generated:start -->

## Summary

Application state is persisted in URL query parameters rather than Redux-only slices, enabling bookmarkable and shareable workspace configurations. Parameters are parsed with defensive type coercion and synchronized bidirectionally between URL and Redux.

## Related

- part of [[track-labeler-routing]] — Routes system implements query encoding/decoding and middleware synchronization
- uses [[workspace-and-project-configuration]] — Query parameters encode startDate, endDate, filteredSpeed, filteredElevation, and other workspace filters that control project display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
