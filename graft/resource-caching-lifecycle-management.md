---
name: Resource Caching & Lifecycle Management
slug: resource-caching-lifecycle-management
type: concept
sources:
  - path: libs/api-types/src/resources.ts
    hash: e0d07ffaff979658a6e389f98413ca023731021c6737c92f28a0d7c3b687507f
sources_digest: a515ad1582daae6624b7b492690051a2e180b9b6ae8461bcefb8e58503fdde86
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Resource management patterns fundamental to data fetching and caching
      layer
generator:
  version: 1
covers:
  - symbol: ResourceResponseType
    kind: type
    at: 'libs/api-types/src/resources.ts:L4-L5'
  - symbol: ResourceRequestType
    kind: type
    at: 'libs/api-types/src/resources.ts:L7-L7'
  - symbol: ResourceStatus
    kind: enum
    at: 'libs/api-types/src/resources.ts:L9-L15'
  - symbol: Resource
    kind: type
    at: 'libs/api-types/src/resources.ts:L17-L27'
---

<!-- context:generated:start -->

## Summary

Resource<T> generic type represents cached data container linking dataview to dataset through DataviewDatasetConfig, storing metadata (URL, request/response format preferences, lifecycle status). ResourceStatus enum tracks async operations: Idle→Loading→Finished|Error|Aborted. ResourceResponseType discriminates response format preferences (default, default_json, etc.). ResourceRequestType specifies request format. Optional 'key' field supports flexible reducer storage; number-or-string dataviewId accommodates multiple ID schemes. Serves as foundational contract for resource management middleware and likely consumed by reducer logic, request interceptors, and normalized response caching.

## Related

- part of [[api-types-type-definitions]] — Resource management patterns fundamental to data fetching and caching layer

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
