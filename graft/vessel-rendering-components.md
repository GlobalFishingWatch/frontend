---
name: Vessel Rendering Components
slug: vessel-rendering-components
type: system
sources:
  - path: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx
    hash: 52024e7581e297faef1d3ba31996a413beb09dedb8f0d3c4e78220d4746b3052
  - path: apps/platform/features/_map/map/popups/shared/vessels-table.utils.ts
    hash: c4d259f92ca414d07b19ab7ec25fbef28a0f76d317b0e9f18daf1b8da44348ca
  - path: apps/platform/features/_map/map/popups/shared/VesselsTable.tsx
    hash: b426e05a7d81ec09e71d15931cfecf890bd74d9131cd6c0a8e8e041107327af9
sources_digest: 037a0af3167af0a66d97305728ba6d54a867268dd12099ff4690c3f5174eaa4a
links:
  - to: dataset-utilities
    relation: uses
    description: VesselsTable uses getDatasetLabel for consistent vessel dataset naming
generator:
  version: 1
covers:
  - symbol: VesselDetectionTimestamps
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx:L15-L62
  - symbol: VesselsTable
    kind: function
    at: 'apps/platform/features/_map/map/popups/shared/VesselsTable.tsx:L50-L289'
  - symbol: getVesselsInfoConfig
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/shared/vessels-table.utils.ts:L4-L13
---

<!-- context:generated:start -->

## Summary

Specialized components for displaying vessel data within map popups, including vessel name links, flag pins, detection timestamps, and multi-vessel tables. These components bridge vessel metadata from Redux, dataset information, and user interaction state to present vessel identity and associated activity data in a consistent format.

## Related

- uses [[dataset-utilities]] — VesselsTable uses getDatasetLabel for consistent vessel dataset naming

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
