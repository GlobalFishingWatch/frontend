---
name: Dataset Information Display
slug: dataset-information-display
type: system
sources:
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx
    hash: 265ed5719848d8e41e5a1d7b82c8d0ecefb388a15e65febb56bb160f450c44af
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/UserDatasetInfoContainer.tsx
    hash: 9fe198623082f5f1cb61a86efe9b730c2370e3ae932cd5994a7e381ffd799e09
  - path: apps/platform/features/_map/datasets/datasets.debug.ts
    hash: 4b7c622fbcfed90a6bfce8972203da669851d468132dc8f0cbea4f5d8fe4bad9
sources_digest: 1cf141c4914a7f96d1c3081894578bbf1bcf6b6e7ee596d99b2310640bdc8113
links:
  - to: content-panel-layout-and-navigation
    relation: part_of
    description: >-
      DatasetInfoContainer and UserDatasetInfoContainer are lazy-loaded content
      variants in ContentPanel
  - to: dataview-instance-management
    relation: uses
    description: >-
      Retrieves dataview instances and filters datasets based on dataview type
      (heatmapVectors, track)
  - to: router-and-url-state-management
    relation: uses
    description: >-
      Syncs selected dataset tab to URL via sidePanelSubcontentId query
      parameter
generator:
  version: 1
covers:
  - symbol: DatasetInfoContainer
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L35-L146
  - symbol: updateSubsectionId
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L110-L113
  - symbol: UserDatasetInfoContainer
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/UserDatasetInfoContainer.tsx:L13-L32
  - symbol: debugDatasetsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.debug.ts:L9-L28'
  - symbol: debugRelatedDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.debug.ts:L31-L49'
---

<!-- context:generated:start -->

## Summary

Multi-tabbed side panel components displaying dataset descriptions, metadata, and relationships for both dataview-attached and user-uploaded datasets. Filters dataset lists by dataview type (heatmap vectors, tracks) and synchronizes selected tab via URL state.

## Related

- part of [[content-panel-layout-and-navigation]] — DatasetInfoContainer and UserDatasetInfoContainer are lazy-loaded content variants in ContentPanel
- uses [[dataview-instance-management]] — Retrieves dataview instances and filters datasets based on dataview type (heatmapVectors, track)
- uses [[router-and-url-state-management]] — Syncs selected dataset tab to URL via sidePanelSubcontentId query parameter

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
