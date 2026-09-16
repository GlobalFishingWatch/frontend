---
name: Dataset Configuration and Filtering
slug: dataset-configuration-and-filtering
type: system
sources:
  - path: libs/datasets-client/src/datasets.config.ts
    hash: ba40f08b11fe62f183613a60a2139093e2dc137e2428d43b2e902459c0bb3031
  - path: libs/datasets-client/src/datasets.filters.ts
    hash: 959f3c023155b2ac0eea747007db0b470b5467f58738271c89e2ca7103bbe981
  - path: libs/datasets-client/src/datasets.ranges.ts
    hash: 61a2ef40e5822e788ab80fd76d095dc1b459e0da3c6af42dc8aa5ab729b75281
sources_digest: cccdca30a1aef5af3e8a49690b5868ab97a1c6149d5451bb791b23626aa852d8
links:
  - to: api-endpoint-configuration
    relation: depends_on
    description: >-
      Endpoint configurations define parameter schemas that depend on filter
      types from datasets.filters
  - to: dataset-utilities-and-version-management
    relation: uses
    description: >-
      Depends on dataset version and namespace utility functions for dataset
      introspection
generator:
  version: 1
covers:
  - symbol: DataList
    kind: type
    at: 'libs/datasets-client/src/datasets.config.ts:L12-L12'
  - symbol: DatasetSchemaGeneratorProps
    kind: type
    at: 'libs/datasets-client/src/datasets.config.ts:L14-L16'
  - symbol: DatasetConfigurationProperty
    kind: type
    at: 'libs/datasets-client/src/datasets.config.ts:L18-L18'
  - symbol: DatasetProperty
    kind: type
    at: 'libs/datasets-client/src/datasets.config.ts:L20-L20'
  - symbol: getDatasetConfigurationProperty
    kind: function
    at: 'libs/datasets-client/src/datasets.config.ts:L43-L68'
  - symbol: getDatasetConfiguration
    kind: function
    at: 'libs/datasets-client/src/datasets.config.ts:L70-L75'
  - symbol: getDatasetGeometryType
    kind: function
    at: 'libs/datasets-client/src/datasets.config.ts:L77-L88'
  - symbol: getEnvironmentalDatasetRange
    kind: function
    at: 'libs/datasets-client/src/datasets.config.ts:L90-L105'
  - symbol: getFlattenDatasetFilters
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L11-L19'
  - symbol: getDatasetFiltersAllowed
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L21-L27'
  - symbol: getDatasetFilterItem
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L29-L43'
  - symbol: datasetHasFilter
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L45-L67'
  - symbol: isFilterInFiltersAllowed
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L69-L88'
  - symbol: datasetHasFilterAllowed
    kind: function
    at: 'libs/datasets-client/src/datasets.filters.ts:L90-L95'
  - symbol: getDatasetRangeSteps
    kind: function
    at: 'libs/datasets-client/src/datasets.ranges.ts:L5-L14'
---

<!-- context:generated:start -->

## Summary

Type-safe accessors and utilities for dataset properties stored in the @globalfishingwatch/api-types Dataset structure. getDatasetConfigurationProperty retrieves typed values from nested configurations with backward compatibility for older datasets via flattened root-level properties. Specialized helpers (getDatasetGeometryType, getEnvironmentalDatasetRange, getFlattenDatasetFilters, getDatasetFiltersAllowed) extract common metadata. Supports dynamic query and validation of filter properties (datasetHasFilter, isFilterInFiltersAllowed), handling special cases like vessel-groups delegation, flag substring matching, and nested dotted paths for dynamic vessel identity sources.

## Related

- depends on [[api-endpoint-configuration]] — Endpoint configurations define parameter schemas that depend on filter types from datasets.filters
- uses [[dataset-utilities-and-version-management]] — Depends on dataset version and namespace utility functions for dataset introspection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
