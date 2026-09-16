---
name: Event and Segment Data Operations
slug: event-and-segment-data-operations
type: system
sources:
  - path: libs/data-transforms/src/events/events-to-bbox.ts
    hash: a472b0b0416b81127f84ffeeb1294c7253f994cfe823856f30aae4814c8fbe34
  - path: libs/data-transforms/src/events/index.ts
    hash: 57509fa6f0a34fea3ba1651c87aa767727deefc2857695881baf4e3c700aad75
  - path: libs/data-transforms/src/points/index.ts
    hash: 1524f174795ba0303febbd665d7b0def4423b2acd1fb732aa5a838d68832eddc
sources_digest: cfea79bd4fe81672650b71e8460aef805cc5a3ab60c39eef888abb78c73806b5
links:
  - to: api-type-contracts
    relation: depends_on
    description: eventsToBbox depends on ApiEvent type from @globalfishingwatch/api-types
generator:
  version: 1
covers:
  - symbol: eventsToBbox
    kind: function
    at: 'libs/data-transforms/src/events/events-to-bbox.ts:L9-L16'
---

<!-- context:generated:start -->

## Summary

Utilities for converting and querying event and segment data, including eventsToBbox (converts API events to geographic bounding boxes), segment configuration and metadata handling, and point-to-GeoJSON conversion. These modules bridge API event structures from @globalfishingwatch/api-types and internal segment coordinate property tracking to support downstream visualization and filtering.

## Related

- depends on [[api-type-contracts]] — eventsToBbox depends on ApiEvent type from @globalfishingwatch/api-types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
