---
name: Track Correction and Vessel Identity
slug: track-correction-and-vessel-identity
type: concept
sources:
  - path: apps/platform/features/_map/bigquery/turning-tides.config.ts
    hash: 78015d08e6c0f2df807ed991c889624db3bf3f02d7e0c38dcd8f6b9e822dcf1b
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx
    hash: 265ed5719848d8e41e5a1d7b82c8d0ecefb388a15e65febb56bb160f450c44af
sources_digest: ed555374af3281c3c65940ea0ee5efffd6e545852807b6d7165fbee8688ffbdc
links:
  - to: turning-tides-regional-dataset-feature
    relation: implements
    description: >-
      Turning Tides modal uses vessel identity datasets from country option
      configurations
generator:
  version: 1
covers:
  - symbol: TurningTidesCountryOption
    kind: type
    at: 'apps/platform/features/_map/bigquery/turning-tides.config.ts:L9-L9'
  - symbol: DatasetInfoContainer
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L35-L146
  - symbol: updateSubsectionId
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L110-L113
---

<!-- context:generated:start -->

## Summary

Vessel identity dataset configuration and track correction workflows, with TurningTidesWorkspaceId type coupling region-specific dataset choices. Track dataviews filter to datasets with valid vessel IDs; identity datasets distinguish fishing vs non-fishing vessel classifications.

## Related

- implements [[turning-tides-regional-dataset-feature]] — Turning Tides modal uses vessel identity datasets from country option configurations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
