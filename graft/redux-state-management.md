---
name: Redux State Management
slug: redux-state-management
type: system
sources:
  - path: apps/platform/features/_map/bigquery/bigquery.hooks.ts
    hash: 5cd4165760cb63c7c0dcedc9ba5b406a5a102f8764b7f8e88081d29a9ad2274b
  - path: apps/platform/features/_map/bigquery/bigquery.slice.ts
    hash: 6ffc2bea88f2c8643691220c88610d989a9efc9f43ff40b566231190802529b4
  - path: apps/platform/features/_map/content-panel/chat/ChatContainer.tsx
    hash: 159cfd9c2b258d6bff4fe06a351b6fdae78eef3259f11af03c7e6cb8184115d9
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx
    hash: 265ed5719848d8e41e5a1d7b82c8d0ecefb388a15e65febb56bb160f450c44af
sources_digest: 2e3282b925c9e8952729bec1d3698e7bba067ed2784548995acddf43a717fded
links:
  - to: async-operation-patterns
    relation: implements
    description: >-
      Async thunks leverage AsyncReducerStatus for loading/error/success state;
      modals.slice resets state via matcher callbacks
  - to: user-authentication-and-authorization
    relation: uses
    description: >-
      Redux selectors (selectIsGuestUser, selectIsGFWUser, selectUserId) control
      feature access and content visibility
generator:
  version: 1
covers:
  - symbol: useBigQueryModal
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L25-L89'
  - symbol: onRunCostClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L37-L49'
  - symbol: onCreateClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L51-L72'
  - symbol: BigQueryVisualisation
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L17-L17'
  - symbol: RunCostResponse
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L19-L22'
  - symbol: CreateBigQueryDataset
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L24-L34'
  - symbol: CreateBigQueryDatasetResponse
    kind: type
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L61-L66'
  - symbol: BigQueryState
    kind: interface
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L112-L116'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/bigquery/bigquery.slice.ts:L176-L176'
  - symbol: ChatContainer
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatContainer.tsx:L11-L37'
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

RTK-based store architecture with lazy-loaded slices (bigquery.slice, datasets.slice, modals.slice) managing async thunks for API calls and matcher callbacks for cross-slice coordination. Selectors expose computed state for consumption; modals.slice integrates with other slices to reset state on modal open/close events.

## Related

- implements [[async-operation-patterns]] — Async thunks leverage AsyncReducerStatus for loading/error/success state; modals.slice resets state via matcher callbacks
- uses [[user-authentication-and-authorization]] — Redux selectors (selectIsGuestUser, selectIsGFWUser, selectUserId) control feature access and content visibility

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
