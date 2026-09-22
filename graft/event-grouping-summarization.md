---
name: Event Grouping & Summarization
slug: event-grouping-summarization
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx
    hash: db455dffde8b18e272ac5c5d3de52ecda9ee7e424de2ed7657a2d08847a7ae6e
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx
    hash: c325b832fc64b895930c2f70d748694251aee63d16413393338f1e2c024ba006
  - path: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts
    hash: a0ed8cd43c8ab06ebe87377f89855283e30bb0d991a52290e67ae54aaeebc63d
sources_digest: c6b16677337a70f9502e45570cfe47f749a62be656e7d3814b985694615cd873
links:
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      selectEventsGroupedByType/Voyage, selectActivitySummary, and
      selectEventsGroupedByArea implement grouping and aggregation logic
generator:
  version: 1
covers:
  - symbol: VesselActivity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L22-L96'
  - symbol: setActivityMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L30-L36'
  - symbol: VesselActivitySummary
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx:L39-L257
  - symbol: ActivityEvent
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts:L22-L25
---

<!-- context:generated:start -->

## Summary

Events partitioned by type or voyage with synthetic Port entry/exit splits. Region priority ordering (REGIONS_PRIORITY) selects high-value regions for display. Aggregations compute fishing hours, port visit stats, and activity regions. Filters output by timerange and visible-events Redux state.

## Related

- implements [[vessel-activity-event-system]] — selectEventsGroupedByType/Voyage, selectActivitySummary, and selectEventsGroupedByArea implement grouping and aggregation logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
