---
name: Activity Type Ontology
slug: activity-type-ontology
type: concept
sources:
  - path: apps/track-labeler/src/routes/routes.selectors.ts
    hash: e67b5eafc2aeae134265ca2925a8193bfd69bbac2e647535a2caefb10b97b177
  - path: apps/track-labeler/src/types/index.ts
    hash: e4bec0d7db2784f42e8a02231801280a31e0955f54d3c04339f19881e28b242b
sources_digest: 23c6bf72553bdc8c15cc2305c495d86413de7934f779a0be5660c8d6937d0028
links:
  - to: track-selection-and-undo
    relation: validates
    description: >-
      Selected track segments must have action labels matching ActionType enum;
      schema validation enforces color compatibility
  - to: workspace-and-project-configuration
    relation: implements
    description: >-
      Projects define custom label definitions that extend or override the base
      ActionType enum via PROJECTS config
generator:
  version: 1
covers:
  - symbol: selectLocation
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L11-L13'
  - symbol: selectQueryParam
    kind: function
    at: 'apps/track-labeler/src/routes/routes.selectors.ts:L22-L28'
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

Defines the 16+ action types and their rendering colors (fishing, hauling, trawling, transiting, etc.). Activity labels are stored in track selections and must conform to the ActionType enum; color mappings are applied at render time via TRACK_COLORS or project overrides.

## Related

- validates [[track-selection-and-undo]] — Selected track segments must have action labels matching ActionType enum; schema validation enforces color compatibility
- implements [[workspace-and-project-configuration]] — Projects define custom label definitions that extend or override the base ActionType enum via PROJECTS config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
