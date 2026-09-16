---
name: Dataviews Filter Configuration
slug: dataviews-filter-configuration
type: file
sources:
  - path: apps/platform/features/_map/dataviews/dataviews.filters.ts
    hash: 87f7c755d567b431f513138669a98f84ebe8fa8a62f92deaa0dc10756cb58c35
sources_digest: 53f536fd4ab7332cb006038e135751f854774a8f3c815e347c40a7e3c713ac53
links:
  - to: dataviews-management
    relation: uses
    description: >-
      Dataview instances reference filter configs assembled by
      getFiltersInDataview; migration utilities validate filters using
      isDataviewFilterSupported
  - to: geospatial-data-transform-contracts
    relation: depends_on
    description: >-
      Introspects dataset filter metadata via
      @globalfishingwatch/datasets-client; resolves enum labels from external
      utilities (flags, ports, vessel info)
generator:
  version: 1
covers:
  - symbol: FilterCompatibilityOperation
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L38-L38'
  - symbol: FilterOriginParam
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L40-L40'
  - symbol: GetFiltersInDataviewParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L41-L47'
  - symbol: DataviewWithFilters
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L49-L50'
  - symbol: getIncompatibleFilterSelection
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L52-L90'
  - symbol: isDataviewFilterSupported
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L92-L106'
  - symbol: getDatasetI18nFilter
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L108-L110'
  - symbol: getFilterLabel
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L112-L130'
  - symbol: getFilterEnumLabel
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L132-L139'
  - symbol: getSupportedFilterDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L141-L151'
  - symbol: getNotSupportedFilterDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L153-L166'
  - symbol: getCommonFilterTypeInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L168-L177'
  - symbol: DataviewFilterSelection
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L179-L182'
  - symbol: getCommonFiltersInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L184-L282'
  - symbol: getFilterOptionsSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L284-L345'
  - symbol: format
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L312-L313'
  - symbol: getFiltersSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L347-L355'
  - symbol: getFilterOperationInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L357-L365'
  - symbol: getFilterUnitInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L367-L372'
  - symbol: getIsFilterSingleSelection
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L374-L380'
  - symbol: getFilterOperation
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L382-L385'
  - symbol: DataviewFilterConfig
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L386-L397'
  - symbol: getDataviewFilterConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L399-L449'
  - symbol: getFiltersInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L451-L495'
---

<!-- context:generated:start -->

## Summary

Constructs and manages filter configurations for dataview instances by querying dataset metadata and resolving cross-dataset compatibility. Partitions filters into allowed and disabled sets based on dataset support, handles special cases (flag lookups, vessel groups, encounter pairs), and supports mode selection (intersection vs. union) for multi-dataset filter compatibility.

## Related

- uses [[dataviews-management]] — Dataview instances reference filter configs assembled by getFiltersInDataview; migration utilities validate filters using isDataviewFilterSupported
- depends on [[geospatial-data-transform-contracts]] — Introspects dataset filter metadata via @globalfishingwatch/datasets-client; resolves enum labels from external utilities (flags, ports, vessel info)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
