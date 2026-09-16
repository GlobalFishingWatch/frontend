---
name: Mocked Geometry Type Warning Suppression
slug: mocked-geometry-type-warning-suppression
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.utils.ts
    hash: fd774034bb07f6545ab88bbc29df144b51bdbf4a8d2f0249e8dae9ea439a49fc
sources_digest: 38b264e2a4405c099074493a74007b8c49e4d497e0634020fd541d5ca1d61429
links: []
generator:
  version: 1
covers:
  - symbol: VesselInstanceDatasets
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L35-L42'
  - symbol: getVesselTrackDatasetIds
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L44-L57'
  - symbol: bySubcategory
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L51-L52'
  - symbol: isPrivateDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L66-L67'
  - symbol: isPrivateVesselGroup
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L69-L70'
  - symbol: isGFWOnlyDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L77-L78'
  - symbol: getIsSkylightDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L80-L81'
  - symbol: isRealTimeDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L83-L85'
  - symbol: GetDatasetLabelParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L89-L89'
  - symbol: getDatasetLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L90-L97'
  - symbol: getDatasetMatchesSearch
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L99-L106'
  - symbol: getDataviewsSources
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L108-L117'
  - symbol: getDatasetTypeIcon
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L119-L139'
  - symbol: getIsBQEditorDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L140-L149'
  - symbol: warnMissingGeometryType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L152-L158'
  - symbol: groupDatasetsByGeometryType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L160-L190'
  - symbol: getGeometryTypeLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L192-L207'
  - symbol: getDatasetSourceIcon
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L209-L235'
  - symbol: getDatasetTitleByDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L237-L293'
  - symbol: getDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L295-L326'
  - symbol: getDatasetsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L328-L343'
  - symbol: getVesselGroupInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L345-L351'
  - symbol: getVesselGroupsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L353-L364'
  - symbol: getActiveDatasetsInActivityDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L366-L372'
  - symbol: getLatestEndDateFromDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L374-L379'
  - symbol: getActiveDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L381-L396'
  - symbol: getActiveActivityDatasetsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L398-L407'
  - symbol: getEventsDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L409-L423'
  - symbol: filterDatasetsByUserType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L425-L438'
---

<!-- context:generated:start -->

## Summary

The datasets.utils module maintains a memoized set warnedMissingGeometryType to suppress duplicate console warnings when a dataset configuration lacks geometry type metadata. This prevents log spam during development and testing when multiple components query incomplete datasets.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
