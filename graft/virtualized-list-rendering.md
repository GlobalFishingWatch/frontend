---
name: Virtualized List Rendering
slug: virtualized-list-rendering
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx
    hash: 7bef2fb0366551d86dbe29a2ffa64c57cd6948b9f3b470dda12ddc339bd71b55
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx
    hash: b5b284adaf7be447f9873a5b9aa89a5418a446c89b6937fadf3ba8e5918e5a40
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx
    hash: db455dffde8b18e272ac5c5d3de52ecda9ee7e424de2ed7657a2d08847a7ae6e
sources_digest: 8093a269a967f727129e788d6b0d4ea8b73f59c09bccdccdfa1567ae1f1ea206
links:
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      ActivityByType and ActivityByVoyage use GroupedVirtuoso with custom scroll
      parent, fallback to Fragment on print mode
generator:
  version: 1
covers:
  - symbol: VesselActivity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L22-L96'
  - symbol: setActivityMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L30-L36'
  - symbol: ActivityByType
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx:L36-L220
  - symbol: ActivityByVoyage
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx:L35-L222
---

<!-- context:generated:start -->

## Summary

Uses react-virtuoso GroupedVirtuoso for large event lists, paired with print-mode fallback for flat rendering. Maintains scroll element references via DOM query (ACTIVITY_CONTAINER_ID), supports collapse/expand per group, and optimizes by filtering when specific event groups are invisible.

## Related

- implements [[vessel-activity-event-system]] — ActivityByType and ActivityByVoyage use GroupedVirtuoso with custom scroll parent, fallback to Fragment on print mode

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
