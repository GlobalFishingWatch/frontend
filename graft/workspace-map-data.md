---
name: Workspace & Map Data
slug: workspace-map-data
type: system
sources:
  - path: apps/platform/features/data/regions/regions.hooks.ts
    hash: 26878784bbdd59987e7c0b98151068fbdd79ad36ca4a28d6b2ca52b0360e74dd
  - path: apps/platform/features/data/regions/regions.selectors.ts
    hash: a24dea2a5b39287d7af88ff82a8e5987113df8bb7b569473315e7467cbb7654f
  - path: apps/platform/features/data/regions/regions.slice.ts
    hash: 6a183c972a2b8fb17a4155e549736fc86db3c2897787069dd4d60fca1febc63a
  - path: apps/platform/features/data/resources/resources.hooks.ts
    hash: a40568cc2294d58789e94f75e1487ea896a5050cf081502a92f978fbc5dc4721
  - path: apps/platform/features/data/resources/resources.selectors.ts
    hash: 26fc697e5ec76938152083c925797684bc8d0b59fd144357198d3e4af16a1186
  - path: apps/platform/features/data/resources/resources.slice.ts
    hash: fea5419ec0a0b1a3fb2ccf296d7c9110603ef17087678086349682804447edf0
sources_digest: f5f3b9fe6c959e5f2889ab06c676aaf7748ac236f2dd80e737ff7d1238b30519
links:
  - to: cms-content-management
    relation: depends_on
    description: >-
      Regions and resources may be augmented with CMS metadata for display
      labels and descriptions
  - to: data-layer-api
    relation: depends_on
    description: >-
      Fetches regions from Global Fishing Watch API via GFWAPI client; resources
      from dataviews-client package
  - to: router-integration
    relation: uses
    description: Workspace state synced bidirectionally with router query parameters
generator:
  version: 1
covers:
  - symbol: useRegionTranslationsById
    kind: function
    at: 'apps/platform/features/data/regions/regions.hooks.ts:L16-L39'
  - symbol: useRegionNamesByType
    kind: function
    at: 'apps/platform/features/data/regions/regions.hooks.ts:L43-L74'
  - symbol: RegionId
    kind: type
    at: 'apps/platform/features/data/regions/regions.slice.ts:L12-L12'
  - symbol: Region
    kind: interface
    at: 'apps/platform/features/data/regions/regions.slice.ts:L13-L16'
  - symbol: Regions
    kind: interface
    at: 'apps/platform/features/data/regions/regions.slice.ts:L17-L20'
  - symbol: RegionsState
    kind: type
    at: 'apps/platform/features/data/regions/regions.slice.ts:L21-L21'
  - symbol: FetchRegionsThunkParams
    kind: type
    at: 'apps/platform/features/data/regions/regions.slice.ts:L27-L27'
  - symbol: selectRegions
    kind: function
    at: 'apps/platform/features/data/regions/regions.slice.ts:L93-L95'
  - symbol: useFetchResources
    kind: function
    at: 'apps/platform/features/data/resources/resources.hooks.ts:L10-L25'
  - symbol: useFetchDataviewResources
    kind: function
    at: 'apps/platform/features/data/resources/resources.hooks.ts:L28-L31'
---

<!-- context:generated:start -->

## Summary

Centralized Redux state and selectors for map workspace configuration, dataset visibility, dataview instances, and geographic regions (EEZs, MPAs, RFMOs, FAOs). Lazy-loads region data on demand and filters resources by event visibility settings. Provides memoized selectors for performance across the map UI.

## Related

- depends on [[cms-content-management]] — Regions and resources may be augmented with CMS metadata for display labels and descriptions
- depends on [[data-layer-api]] — Fetches regions from Global Fishing Watch API via GFWAPI client; resources from dataviews-client package
- uses [[router-integration]] — Workspace state synced bidirectionally with router query parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
