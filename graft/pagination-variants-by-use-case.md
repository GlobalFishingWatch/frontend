---
name: Pagination Variants by Use Case
slug: pagination-variants-by-use-case
type: concept
sources:
  - path: libs/api-types/src/pagination.ts
    hash: 43ce4868bb9a2035a32f958d23344f6cf77260dbdb59e6d2c022c12049dd0475
sources_digest: 20e75cf26e0bdc04523e9ea54524620b3af37e4c6547f245360131735cd3a0f9
links:
  - to: api-types-type-definitions
    relation: part_of
    description: Pagination abstractions used throughout API response types
generator:
  version: 1
covers:
  - symbol: APIPagination
    kind: type
    at: 'libs/api-types/src/pagination.ts:L1-L12'
  - symbol: APIVesselSearchPagination
    kind: type
    at: 'libs/api-types/src/pagination.ts:L14-L24'
---

<!-- context:generated:start -->

## Summary

APIPagination generic uses offset-based pagination with query metadata including search suggestions and dataset filtering for general listings. APIVesselSearchPagination specializes to cursor-based pagination via 'since' parameter for vessel lookups with query normalization and 'did you mean' suggestions. Both generic over entries content type, enabling them to wrap any response data structure while maintaining consistent pagination interface.

## Related

- part of [[api-types-type-definitions]] — Pagination abstractions used throughout API response types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
