---
name: Throttled State Updates for UI Responsiveness
slug: throttled-state-updates-for-ui-responsiveness
type: concept
sources:
  - path: apps/track-labeler/src/features/map/Map.tsx
    hash: d8f4eb5353fe91bc98786000f3f2629cd244c3fca9b9a32c51ce78c3353b30b1
  - path: apps/track-labeler/src/features/timebar/Timebar.tsx
    hash: 06eb401427cec04a6830e582a105d6cf02a449b32854669413fedc6c6de0e0fd
sources_digest: c531b57106b1c55aa5285a6148461e5e35a0af5982dd6e66ab5b0868c177bc5a
links: []
generator:
  version: 1
covers:
  - symbol: MapComponent
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L40-L184'
  - symbol: handleLegendClick
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L84-L86'
  - symbol: updateBounds
    kind: function
    at: 'apps/track-labeler/src/features/map/Map.tsx:L100-L125'
  - symbol: DayNightTimebarLayer
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L38-L72'
  - symbol: TimebarWrapper
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L75-L315'
  - symbol: handleSpeedChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L122-L124'
  - symbol: handleElevationChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L125-L127'
  - symbol: handleDistanceFromPortChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L128-L130'
  - symbol: handleTimeChange
    kind: function
    at: 'apps/track-labeler/src/features/timebar/Timebar.tsx:L131-L133'
---

<!-- context:generated:start -->

## Summary

High-frequency user interactions (viewport panning, timebar dragging, cursor hovering) are throttled before Redux dispatch to prevent excessive store updates and re-renders. Timebar local range state throttles at 200ms; Map viewport updates throttle at 100ms; time highlighting may throttle to avoid lag during fast clicks. Throttling decouples UI responsiveness (immediate visual feedback via local state) from Redux synchronization (delayed dispatch), critical for smooth interaction on lower-end devices. Implemented via es-toolkit's throttle utility.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
