---
name: Vessel Activity Data
slug: vessel-activity-data
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/vessels/report-activity-vessels.selectors.ts
    hash: 49c57e7dff54236fbeec3f587d3981d18f1973501dfe8e4836b3fdd657d8d44d
sources_digest: d8c1429c73e720325cd7477858abc7a14d9e697cc2ae2d0abd2228caa4864387
links:
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      Selectors read from selectReportActivityFlatten and other report state to
      transform raw vessel data
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Redux selectors that aggregate and correlate individual vessel activity records with related datasets (vessel info, tracking data). Groups activities by vesselId, enriches with dataset relationships, and provides sorted lists of vessels with associated metrics (hours, event counts). Integrates with datasets slice to resolve related dataset types.

## Related

- depends on [[activity-report-redux-state]] — Selectors read from selectReportActivityFlatten and other report state to transform raw vessel data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
