---
name: BigQuery Modal and Custom Dataset Creation
slug: bigquery-modal-and-custom-dataset-creation
type: system
sources:
  - path: apps/platform/features/_map/bigquery/bigquery.config.ts
    hash: 7927083be1676d9816336eb5e363aad1feb9fe6484bb971102b54c39c3d130b6
  - path: apps/platform/features/_map/bigquery/bigquery.hooks.ts
    hash: 5cd4165760cb63c7c0dcedc9ba5b406a5a102f8764b7f8e88081d29a9ad2274b
  - path: apps/platform/features/_map/bigquery/bigquery.slice.ts
    hash: 6ffc2bea88f2c8643691220c88610d989a9efc9f43ff40b566231190802529b4
  - path: apps/platform/features/_map/bigquery/BigQueryModal.tsx
    hash: af58b852a3d6f8c4eaa260e2b09664bb0ba35d58afc57eae8017bb5288f9aa45
sources_digest: 45b605d46e5c050df76a73ba21a598e2250de6b9e84fa7385ad411156beeedc1
links:
  - to: async-operation-patterns
    relation: implements
    description: >-
      Uses AsyncReducerStatus to track fetchBigQueryRunCostThunk and
      createBigQueryDatasetThunk lifecycle states
  - to: dataview-instance-management
    relation: produces
    description: >-
      Creates and registers new dataview instances (4wings or events mode) after
      successful dataset creation
  - to: redux-state-management
    relation: uses
    description: >-
      Manages creation/runCost state via Redux thunks and selectors; integrates
      with modals.slice for modal lifecycle
generator:
  version: 1
covers:
  - symbol: BigQueryModal
    kind: function
    at: 'apps/platform/features/_map/bigquery/BigQueryModal.tsx:L23-L170'
  - symbol: handleCreateClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/BigQueryModal.tsx:L52-L63'
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
---

<!-- context:generated:start -->

## Summary

Feature suite enabling users to create custom BigQuery-based map visualizations by querying data, selecting visualization modes (4wings/events), and validating cost before submission. Manages query validation, cost estimation, and dataview instantiation through a multi-step modal workflow.

## Related

- implements [[async-operation-patterns]] — Uses AsyncReducerStatus to track fetchBigQueryRunCostThunk and createBigQueryDatasetThunk lifecycle states
- produces [[dataview-instance-management]] — Creates and registers new dataview instances (4wings or events mode) after successful dataset creation
- uses [[redux-state-management]] — Manages creation/runCost state via Redux thunks and selectors; integrates with modals.slice for modal lifecycle

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
