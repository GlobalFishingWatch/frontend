---
name: Two-Click Interaction Pattern for Segment Creation
slug: two-click-interaction-pattern-for-segment-creation
type: concept
sources:
  - path: apps/track-labeler/src/features/timebar/timebar.hooks.ts
    hash: ff368cee5d1e43e34af9b551176efa2c4fa4ad93d3585f56098bd52e6e398d80
sources_digest: 8f912b43b649f870c138d8422b8249247e8b3dfcf7860ddc92d19dc47b5de9ce
links:
  - to: segment-labeling-track-annotation
    relation: implements
    description: >-
      useSegmentsLabeledConnect manages pendingSegment transient state and
      dispatches finalized segments to Redux.
generator:
  version: 1
covers:
  - symbol: useTimerangeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L24-L94'
  - symbol: useTimebarModeConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L96-L114'
  - symbol: dispatchTimebarMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L101-L102'
  - symbol: dispatchFilterMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L103-L104'
  - symbol: dispatchColorMode
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L105-L105'
  - symbol: useSegmentsLabeledConnect
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L116-L294'
  - symbol: createNewSegment
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L128-L166'
  - symbol: handleSegmentOverlap
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L168-L244'
  - symbol: onEventPointClick
    kind: function
    at: 'apps/track-labeler/src/features/timebar/timebar.hooks.ts:L246-L287'
---

<!-- context:generated:start -->

## Summary

Segment labeling in the timebar uses a transient two-click pattern: the first click on a time point sets pendingSegment state (start timestamp, coordinates); the second click finalizes the segment with end coordinates and dispatches setSelectedTrack/addSelectedTrack to Redux. The pattern requires careful state reset on errors and distinguishes between initial click (no segment) and drag-to-finalize semantics. This decoupling of UI state (pendingSegment) from Redux allows responsive visual feedback while maintaining consistency with the store.

## Related

- implements [[segment-labeling-track-annotation]] — useSegmentsLabeledConnect manages pendingSegment transient state and dispatches finalized segments to Redux.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
