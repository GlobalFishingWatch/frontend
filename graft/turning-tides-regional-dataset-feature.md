---
name: Turning Tides Regional Dataset Feature
slug: turning-tides-regional-dataset-feature
type: system
sources:
  - path: apps/platform/features/_map/bigquery/turning-tides.config.ts
    hash: 78015d08e6c0f2df807ed991c889624db3bf3f02d7e0c38dcd8f6b9e822dcf1b
  - path: apps/platform/features/_map/bigquery/TurningTidesModal.tsx
    hash: 37c7ceb301006295b6e7d9cc1556ebedfb3dfa0c69cf2a6f6a88e3fcddd13b17
sources_digest: f3dcc52c870d08545982b51a42a0d0308dca2266a6d1b95f2aebc654be69d0ad
links:
  - to: bigquery-modal-and-custom-dataset-creation
    relation: uses
    description: >-
      Reuses useBigQueryModal hook and cost-checking workflow for dataset
      creation with country-specific configurations
  - to: track-correction-and-vessel-identity
    relation: depends_on
    description: >-
      References TurningTidesWorkspaceId type and DEFAULT_IDENTITY_DATASET_ID
      configuration for vessel identity handling
generator:
  version: 1
covers:
  - symbol: TurningTidesModal
    kind: function
    at: 'apps/platform/features/_map/bigquery/TurningTidesModal.tsx:L22-L148'
  - symbol: handleCreateClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/TurningTidesModal.tsx:L52-L65'
  - symbol: TurningTidesCountryOption
    kind: type
    at: 'apps/platform/features/_map/bigquery/turning-tides.config.ts:L9-L9'
---

<!-- context:generated:start -->

## Summary

Multi-region fishing analysis feature providing country-specific (Brazil, Chile, Peru, global) BigQuery dataset mappings with vessel identity datasets and TTL configurations. Couples dataset selection to country context through a modal interface.

## Related

- uses [[bigquery-modal-and-custom-dataset-creation]] — Reuses useBigQueryModal hook and cost-checking workflow for dataset creation with country-specific configurations
- depends on [[track-correction-and-vessel-identity]] — References TurningTidesWorkspaceId type and DEFAULT_IDENTITY_DATASET_ID configuration for vessel identity handling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
