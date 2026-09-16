---
name: Vessel Track Reconstruction
slug: vessel-track-reconstruction
type: concept
sources:
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.spec.ts
    hash: e469390836f2c6ac28be4295775e77f41b4a43d2a31facff10f06fea0c5ebb7e
  - path: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts
    hash: a5b24176dd792a4dfcc7f0c29d3740536f2ca0eb007d00a174c5cef045b21142
sources_digest: 2c11011b73269d349efc2b9f049246dff4c1a1e229641aff14b5de0530467d30
links: []
generator:
  version: 1
covers:
  - symbol: pos
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.spec.ts:L7-L18
  - symbol: upperFirst
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L8-L10
  - symbol: cleanVesselShipname
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L12-L17
  - symbol: getIsActivityPositionMatched
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L19-L24
  - symbol: getIsDetectionsPositionMatched
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L26-L31
  - symbol: getPositionBearing
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L33-L35
  - symbol: getIsIdInFilterIds
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L39-L47
  - symbol: getIsFeatureInFilterIds
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L49-L51
  - symbol: FourwingsPositionsVesselTrack
    kind: type
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L53-L58
  - symbol: getTrackPath
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L60-L78
  - symbol: getVesselTracks
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L80-L127
  - symbol: filteredPositionsByViewport
    kind: function
    at: >-
      libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts:L129-L142
---

<!-- context:generated:start -->

## Summary

Algorithm for reconstructing vessel movement paths from position pings: groups by vessel ID, orders chronologically, segments on temporal gaps exceeding POSITIONS_TRACK_MAX_GAP_SECONDS, and unwraps longitude by accumulating offsets when coordinate jumps exceed 180° to prevent globe-wrapping artifacts. Produces Float64Array coordinates suitable for deck.gl PathLayer.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
