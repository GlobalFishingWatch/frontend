---
name: Application Type Definitions
slug: application-type-definitions
type: file
sources:
  - path: apps/platform/types/index.ts
    hash: 8ba50274593f16263f319ef8585fc3812d39f2fa973dccadf0260ac8f6f22ff7
sources_digest: 40cbe9b5925f6e81e382e929a0aac537437586e91f7eac39a43699fa3e75dbff
links:
  - to: redux-test-store
    relation: uses
    description: >-
      Redux store fixtures shape state according to WorkspaceState, AppState,
      and related type definitions
  - to: test-navigation-utilities
    relation: uses
    description: >-
      Navigation fixtures construct QueryParams objects that must conform to the
      types defined here
generator:
  version: 1
covers:
  - symbol: WorkspaceViewportParam
    kind: type
    at: 'apps/platform/types/index.ts:L27-L27'
  - symbol: WorkspaceTimeRangeParam
    kind: type
    at: 'apps/platform/types/index.ts:L28-L28'
  - symbol: BufferUnit
    kind: type
    at: 'apps/platform/types/index.ts:L30-L30'
  - symbol: BufferOperation
    kind: type
    at: 'apps/platform/types/index.ts:L32-L32'
  - symbol: WorkspaceStateProperty
    kind: type
    at: 'apps/platform/types/index.ts:L34-L34'
  - symbol: AppStateProperty
    kind: type
    at: 'apps/platform/types/index.ts:L35-L35'
  - symbol: AnyStateProperty
    kind: type
    at: 'apps/platform/types/index.ts:L37-L37'
  - symbol: WorkspaceParam
    kind: type
    at: 'apps/platform/types/index.ts:L39-L45'
  - symbol: WorkspaceViewport
    kind: type
    at: 'apps/platform/types/index.ts:L47-L47'
  - symbol: WorkspaceTimeRange
    kind: type
    at: 'apps/platform/types/index.ts:L48-L48'
  - symbol: BivariateDataviews
    kind: type
    at: 'apps/platform/types/index.ts:L50-L50'
  - symbol: TimeMode
    kind: type
    at: 'apps/platform/types/index.ts:L52-L52'
  - symbol: WorkspaceState
    kind: interface
    at: 'apps/platform/types/index.ts:L56-L123'
  - symbol: AnyWorkspaceState
    kind: type
    at: 'apps/platform/types/index.ts:L125-L125'
  - symbol: RedirectParam
    kind: type
    at: 'apps/platform/types/index.ts:L127-L130'
  - symbol: UserTab
    kind: enum
    at: 'apps/platform/types/index.ts:L132-L143'
  - symbol: SidePanelContent
    kind: type
    at: 'apps/platform/types/index.ts:L145-L155'
  - symbol: TrackCorrectionId
    kind: type
    at: 'apps/platform/types/index.ts:L162-L162'
  - symbol: AppState
    kind: type
    at: 'apps/platform/types/index.ts:L165-L183'
  - symbol: QueryParams
    kind: type
    at: 'apps/platform/types/index.ts:L185-L192'
  - symbol: QueryParam
    kind: type
    at: 'apps/platform/types/index.ts:L194-L194'
  - symbol: TimebarVisualisations
    kind: enum
    at: 'apps/platform/types/index.ts:L196-L204'
  - symbol: TimebarVisualisation
    kind: type
    at: 'apps/platform/types/index.ts:L205-L205'
  - symbol: VisibleEvents
    kind: type
    at: 'apps/platform/types/index.ts:L207-L207'
  - symbol: TimebarGraphs
    kind: enum
    at: 'apps/platform/types/index.ts:L209-L213'
  - symbol: Bbox
    kind: type
    at: 'apps/platform/types/index.ts:L216-L216'
  - symbol: MapCoordinates
    kind: type
    at: 'apps/platform/types/index.ts:L218-L222'
---

<!-- context:generated:start -->

## Summary

Comprehensive TypeScript type hub for the platform's state and routing. Defines WorkspaceState (map viewport, timebar, layer visibility), AppState (user tabs, side panels), QueryParams (URL-serializable state), and supporting enums (UserTab, TimebarVisualisations). Establishes the contract between URL encoding and Redux state management.

## Related

- uses [[redux-test-store]] — Redux store fixtures shape state according to WorkspaceState, AppState, and related type definitions
- uses [[test-navigation-utilities]] — Navigation fixtures construct QueryParams objects that must conform to the types defined here

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
