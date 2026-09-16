---
name: Time-range Validation
slug: time-range-validation
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/OutOfBoundsDisclaimer.tsx
    hash: bf2985378204c8c7cc7e15a7e09c1158a71017ebb6a1e2309a967fe9eada7223
sources_digest: 51507c736f6a9bca71cb274dbf6fd2b47ede914e06063f14eaf69e9032aa1bb7
links:
  - to: workspace-dataview-instance-management
    relation: depends_on
    description: >-
      Accesses dataview instances to determine active datasets and validate
      against current time window
generator:
  version: 1
covers:
  - symbol: OutOfTimerangeDisclaimerValidate
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/OutOfBoundsDisclaimer.tsx:L23-L23
  - symbol: OutOfTimerangeDisclaimerProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/OutOfBoundsDisclaimer.tsx:L24-L28
  - symbol: OutOfTimerangeDisclaimer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/OutOfBoundsDisclaimer.tsx:L30-L110
---

<!-- context:generated:start -->

## Summary

OutOfBoundsDisclaimer component that displays warnings when active map data layers fall outside the user's selected time window. Fetches temporal extents via getDatasetsExtent from datasets-client and filters by activity or environment datasets, supporting three validation modes (start, end, or both). Includes special handling for VIIRS satellite layers with distinct delay disclaimers. Integrates with timerange Redux state via useTimerangeConnect.

## Related

- depends on [[workspace-dataview-instance-management]] — Accesses dataview instances to determine active datasets and validate against current time window

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
