---
name: Vessel Dataview Factory Pattern
slug: vessel-dataview-factory-pattern
type: concept
sources:
  - path: libs/dataviews-client/src/config.ts
    hash: be7b96348d13fe0e90fece5ef597d99323b3a92a8df00618c560cd8b7d633d19
  - path: libs/dataviews-client/src/dataviews.utils.ts
    hash: 94721397924d0e126d72fb29149515e94a737b933fc4fe7bccb31e80c80e1f58
sources_digest: 1495ecd47c918897343de34eb478891edde85345fd4387c41911e693e73debd5
links:
  - to: dataview-instance-composition
    relation: implements
    description: Concrete implementation of instance ID formatting and parsing logic
generator:
  version: 1
covers:
  - symbol: getVesselIdFromInstanceId
    kind: function
    at: 'libs/dataviews-client/src/dataviews.utils.ts:L11-L28'
  - symbol: getIsVesselDataviewInstanceId
    kind: function
    at: 'libs/dataviews-client/src/dataviews.utils.ts:L30-L32'
  - symbol: getIsEncounteredVesselDataviewInstanceId
    kind: function
    at: 'libs/dataviews-client/src/dataviews.utils.ts:L34-L36'
  - symbol: getVesselDataviewInstanceId
    kind: function
    at: 'libs/dataviews-client/src/dataviews.utils.ts:L38-L41'
  - symbol: getEncounteredVesselDataviewInstanceId
    kind: function
    at: 'libs/dataviews-client/src/dataviews.utils.ts:L43-L44'
---

<!-- context:generated:start -->

## Summary

Encodes vessel IDs and encounter relationships into dataview instance identifiers using prefixes (vessel-, vessel-encounter-) and version separators. Provides bidirectional parsing to extract vessel IDs and construct properly formatted instance IDs with fallback behavior for legacy formats.

## Related

- implements [[dataview-instance-composition]] — Concrete implementation of instance ID formatting and parsing logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
