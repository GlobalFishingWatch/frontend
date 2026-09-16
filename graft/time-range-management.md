---
name: Time Range Management
slug: time-range-management
type: system
sources:
  - path: apps/platform/features/_map/timebar/timerange.hooks.ts
    hash: 42305b3acbf29823c4df54a4088b709a5dcf927dcdfe460767e32e09c930cf61
sources_digest: e084094bef356539b6d677f54f1d404cf049e379bce2987cc11f50baa0935b9b
links:
  - to: timebar-settings-component
    relation: produces
    description: >-
      Provides timerange state consumed by timebar settings and visualization
      controls
  - to: timebar-utility-pipeline
    relation: depends_on
    description: >-
      Time range management uses stickToClosestInterval from data-transforms for
      interval snapping
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Reads and writes Redux selectors from workspace and hints slices for state
      synchronization
generator:
  version: 1
covers:
  - symbol: isValidISODate
    kind: function
    at: 'apps/platform/features/_map/timebar/timerange.hooks.ts:L31-L31'
  - symbol: getTimerangeFromUrl
    kind: function
    at: 'apps/platform/features/_map/timebar/timerange.hooks.ts:L33-L48'
  - symbol: useSetTimerange
    kind: function
    at: 'apps/platform/features/_map/timebar/timerange.hooks.ts:L61-L118'
  - symbol: useTimerangeConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timerange.hooks.ts:L120-L144'
---

<!-- context:generated:start -->

## Summary

Manages map time range state using Jotai atoms, synchronized between timebar UI, Redux store (hints dismissal, workspace readiness, time mode), and URL query parameters. Core exports: timerangeState atom (initialized from URL or defaults), useSetTimerange hook (updates atom and debounces URL navigation at 300ms to prevent storms during scrubbing), useTimebarConnect hook (adapts timebar events into timerange updates with interval snapping and 24-hour minimum duration enforcement outside real-time mode). Critical design constraint: must NOT import from @globalfishingwatch/timebar, deck-layer-composer, or deck.gl to avoid inflating the entry chunk.

## Related

- produces [[timebar-settings-component]] — Provides timerange state consumed by timebar settings and visualization controls
- depends on [[timebar-utility-pipeline]] — Time range management uses stickToClosestInterval from data-transforms for interval snapping
- depends on [[workspace-redux-state]] — Reads and writes Redux selectors from workspace and hints slices for state synchronization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
