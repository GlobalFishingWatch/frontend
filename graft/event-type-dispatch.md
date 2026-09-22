---
name: Event Type Dispatch
slug: event-type-dispatch
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/events/PopupByEventType.tsx
    hash: e4cc385f8d67ef66223703c613f9f51e468a460f52c0aa8a8902a905fb847aad
sources_digest: 8dc15b818dbccf69611976f565c9e3009cd0c9bff50ff99916a9bbc4567b8714
links:
  - to: event-cluster-tooltips
    relation: part_of
    description: Event type dispatch is the core routing logic for event tooltip rendering
generator:
  version: 1
covers:
  - symbol: PopupByEventTypeProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/events/PopupByEventType.tsx:L24-L29'
  - symbol: PopupByEventType
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/PopupByEventType.tsx:L41-L101
---

<!-- context:generated:start -->

## Summary

A routing pattern in PopupByEventType that determines which specialized event tooltip component to render by parsing feature layerId against layer library constants (GFW_CLUSTER_LAYERS: encounter, port visit, loitering, gap) and matching DataviewType.FourwingsTileCluster. The dispatch uses string include() matching against event type names, which can be fragile if naming conventions change, and casts features to event-specific types downstream.

## Related

- part of [[event-cluster-tooltips]] — Event type dispatch is the core routing logic for event tooltip rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
