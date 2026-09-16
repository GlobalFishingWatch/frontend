---
name: Vessel Resource Selectors
slug: vessel-resource-selectors
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/selectors/vessel.resources.selectors.ts
    hash: 10dfd7989b96fc5b29b748f5bba71996a2e239c66528d08804b15052d1129658
  - path: apps/platform/features/_vessels/vessel/selectors/vessel.selectors.ts
    hash: ccb2a2ce2dfcd9f34b81d06bbad5c86ddcd21663f006512e4ca41198c5b781a7
sources_digest: b9d18aec81a3f313df092ae5fdcf7b51dd3cf0bfdc1da1a890f28211cabbee6c
links:
  - to: vessel-redux-state-management
    relation: depends_on
    description: >-
      Chains selectors on top of vessel.slice state to provide filtered and
      enriched event views
generator:
  version: 1
covers:
  - symbol: selectVesselEventsByType
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/selectors/vessel.resources.selectors.ts:L77-L80
  - symbol: selectVesselPrintMode
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/selectors/vessel.selectors.ts:L42-L42
  - symbol: selectVesselFitBoundsOnLoad
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/selectors/vessel.selectors.ts:L43-L44
---

<!-- context:generated:start -->

## Summary

Redux selectors for accessing and filtering vessel-related event and dataset information. Composes multiple upstream selectors to progressively transform raw vessel data into application-ready views: event datasets, timerange-filtered events, voyages (enriched with sequence numbers on Port events), and type-specific event filters. Uses Luxon for timezone-aware datetime conversion and millisecond filtering.

## Related

- depends on [[vessel-redux-state-management]] — Chains selectors on top of vessel.slice state to provide filtered and enriched event views

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
