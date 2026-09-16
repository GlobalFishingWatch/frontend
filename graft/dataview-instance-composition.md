---
name: Dataview Instance Composition
slug: dataview-instance-composition
type: concept
sources:
  - path: libs/dataviews-client/src/config.ts
    hash: be7b96348d13fe0e90fece5ef597d99323b3a92a8df00618c560cd8b7d633d19
  - path: libs/dataviews-client/src/dataviews.utils.ts
    hash: 94721397924d0e126d72fb29149515e94a737b933fc4fe7bccb31e80c80e1f58
sources_digest: 1495ecd47c918897343de34eb478891edde85345fd4387c41911e693e73debd5
links:
  - to: dataview-resolution-filtering
    relation: implements
    description: >-
      Provides utilities for extracting vessel IDs and constructing properly
      formatted instance IDs
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

Merges template definitions from the API with URL-loaded instance overrides and deletions to produce runtime-ready configurations. Handles special cases like vessel prefixes in instance IDs and maintains consistency across naming schemes.

## Related

- implements [[dataview-resolution-filtering]] — Provides utilities for extracting vessel IDs and constructing properly formatted instance IDs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
