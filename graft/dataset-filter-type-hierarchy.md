---
name: Dataset Filter Type Hierarchy
slug: dataset-filter-type-hierarchy
type: file
sources:
  - path: libs/datasets-client/src/filters.ts
    hash: 8f70a89fc29045ae34ba7f81655940539e2475e16362969a977e38ec95b4ee11
sources_digest: 58bb5df8be08e9b414db231a8d6d70005c7dcd471f3c4b1a3083ccea74fa7058
links:
  - to: api-endpoint-configuration
    relation: part_of
    description: >-
      Filter types are used to validate endpoint query parameters by dataset
      type
  - to: dataset-configuration-and-filtering
    relation: part_of
    description: Filter types constrain valid filter queries across dataset types
generator:
  version: 1
covers:
  - symbol: SupportedDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L3-L8'
  - symbol: SupportedActivityDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L10-L38'
  - symbol: SupportedEnvDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L42-L56'
  - symbol: SupportedContextDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L57-L57'
  - symbol: SupportedEventsDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L58-L58'
  - symbol: SupportedVesselDatasetFilter
    kind: type
    at: 'libs/datasets-client/src/filters.ts:L59-L59'
---

<!-- context:generated:start -->

## Summary

Defines SupportedDatasetFilter as a discriminated union of five category-specific filter types (Activity, Env, Context, Events, Vessel) that encode valid filter field names for each dataset domain. Reveals ongoing data model inconsistencies (mixing targetSpecies/target_species and specie/species), debug-only fields like speed in environment filters, and TODO markers for planned naming convention normalization between camelCase and snake_case.

## Related

- part of [[api-endpoint-configuration]] — Filter types are used to validate endpoint query parameters by dataset type
- part of [[dataset-configuration-and-filtering]] — Filter types constrain valid filter queries across dataset types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
