---
name: Cross-feature Scroll Synchronization
slug: cross-feature-scroll-synchronization
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts
    hash: 64227dacee4da1f87e848124928a989ae611576778103ca7d5326469d24ec0b6
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx
    hash: db455dffde8b18e272ac5c5d3de52ecda9ee7e424de2ed7657a2d08847a7ae6e
sources_digest: 126efbf5535951fa06a3181705dd04d0e99768ef50282a6399b9f25ff498b25c
links:
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      useEventsScroll hook coordinates scroll position and event selection
      across virtualized lists
generator:
  version: 1
covers:
  - symbol: VesselActivity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L22-L96'
  - symbol: setActivityMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L30-L36'
  - symbol: useVirtuosoScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L33-L63
  - symbol: useVirtuosoScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L65-L109
  - symbol: useVesselProfileScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L111-L135
  - symbol: useEventsScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L137-L216
---

<!-- context:generated:start -->

## Summary

Hybrid Jotai + Redux state coordination: Jotai atom tracks ephemeral scroll position, Redux holds permanent event selection. Debounced scroll callbacks detect center-of-viewport event and auto-select. useVirtuosoScrollToEvent maps event IDs to indices and programmatically scrolls. Prevents auto-select during programmatic scrolls via isScrollingRef flag.

## Related

- implements [[vessel-activity-event-system]] — useEventsScroll hook coordinates scroll position and event selection across virtualized lists

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
