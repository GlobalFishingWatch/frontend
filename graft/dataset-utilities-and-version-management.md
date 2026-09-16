---
name: Dataset Utilities and Version Management
slug: dataset-utilities-and-version-management
type: system
sources:
  - path: libs/datasets-client/src/datasets.utils.spec.ts
    hash: dd792f631ef7a786f93335311e7b6bfbe32ff3f43d4952b3a4d8b2afc5b91ae1
  - path: libs/datasets-client/src/datasets.utils.ts
    hash: 37c6427b29b345d85ac16e733d4414a72a18cb876490318b8608441b4b1ed69e
sources_digest: 86601d752508ffa56e685b3b5f326bdd7bb5a1816c4510ba9392a1ace3ef4e4a
links:
  - to: dataset-configuration-and-filtering
    relation: part_of
    description: >-
      Provides utilities for parsing and validating dataset identifiers and
      versions
generator:
  version: 1
covers:
  - symbol: removeDatasetVersion
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L9-L11'
  - symbol: getDatasetVersion
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L13-L15'
  - symbol: parseDatasetVersion
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L17-L18'
  - symbol: getIsDatasetVersionDowngrade
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L23-L47'
  - symbol: replaceDatasetPublicToPrivate
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L49-L53'
  - symbol: replaceDatasetPrivateToPublic
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L55-L59'
  - symbol: findDatasetByType
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L61-L63'
  - symbol: getUserDataviewDataset
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L65-L75'
  - symbol: getDatasetsExtent
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L77-L102'
  - symbol: getDatasetsLatestEndDate
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L104-L120'
  - symbol: RelatedDatasetByTypeParams
    kind: type
    at: 'libs/datasets-client/src/datasets.utils.ts:L122-L125'
  - symbol: getRelatedDatasetByType
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L127-L142'
  - symbol: getRelatedDatasetsByType
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L144-L159'
  - symbol: getIsVMSDataset
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L162-L164'
  - symbol: DatasetEventSource
    kind: type
    at: 'libs/datasets-client/src/datasets.utils.ts:L165-L165'
  - symbol: getDatasetSource
    kind: function
    at: 'libs/datasets-client/src/datasets.utils.ts:L166-L171'
---

<!-- context:generated:start -->

## Summary

Utility functions for parsing dataset identifiers (removing/extracting versions, splitting on colons), comparing semantic and date-based dataset versions to detect downgrades, translating dataset namespaces (public↔private via prefix replacement), filtering datasets by type, and aggregating temporal metadata (extent, latest end dates) across collections. Identifies VMS versus AIS data sources. Navigates related dataset links with optional full-dataset filtering. Gracefully degrades on malformed version input; assumes dataset IDs follow name:version format with semantic versioning.

## Related

- part of [[dataset-configuration-and-filtering]] — Provides utilities for parsing and validating dataset identifiers and versions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
