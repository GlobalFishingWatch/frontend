---
name: Dataset Utilities and Filtering
slug: dataset-utilities-and-filtering
type: system
sources:
  - path: apps/platform/features/_map/datasets/datasets.permissions.ts
    hash: 76a310bad2263011556ef0dc49fa7b420b1047ed7c0391c25e5de5c57e99d773
  - path: apps/platform/features/_map/datasets/datasets.utils.ts
    hash: fd774034bb07f6545ab88bbc29df144b51bdbf4a8d2f0249e8dae9ea439a49fc
sources_digest: 863947f1c1c203f4293037bb92ce6dcbf50f892525b069a144c8c0688c498c0a
links:
  - to: dataset-management-redux-layer
    relation: uses
    description: >-
      Selectors import utility functions to classify datasets and filter by user
      type/geometry
  - to: dataset-upload-and-parsing
    relation: uses
    description: Upload UI consumes icon/label utilities and privacy check functions
  - to: geospatial-data-transform-contracts
    relation: depends_on
    description: >-
      Imports dataset and dataview configuration introspection from
      @globalfishingwatch/datasets-client and
      @globalfishingwatch/dataviews-client
generator:
  version: 1
covers:
  - symbol: hasDatasetConfigVesselData
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L11-L17'
  - symbol: getActivityDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L19-L41'
  - symbol: getVesselDatasetsDownloadTrackSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L43-L57'
  - symbol: getDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L59-L68'
  - symbol: getDatasetsReportNotSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L70-L79'
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

Provides dataset classification, filtering, and labeling utilities that bridge raw API dataset definitions with UI components. Includes privacy checks, geometry type inference, dataview extraction, and localized title generation for activity datasets (VMS/AIS/VIIRS/SAR).

## Related

- uses [[dataset-management-redux-layer]] — Selectors import utility functions to classify datasets and filter by user type/geometry
- uses [[dataset-upload-and-parsing]] — Upload UI consumes icon/label utilities and privacy check functions
- depends on [[geospatial-data-transform-contracts]] — Imports dataset and dataview configuration introspection from @globalfishingwatch/datasets-client and @globalfishingwatch/dataviews-client

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
