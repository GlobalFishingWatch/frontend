---
name: VMS Dataset Registry
slug: vms-dataset-registry
type: system
sources:
  - path: libs/datasets-client/src/migrations/datasets.latest.ts
    hash: dd010a3ace64ba13dfd667e099d3c38de72f70d1477bf0c5c9b8fa3eee436167
  - path: libs/datasets-client/src/migrations/datasets.migrations-v2.ts
    hash: 7075a966a0a6d514aff9c262f22fa33a5783015f9630a2eb3c5a3e48c842a651
  - path: libs/datasets-client/src/migrations/datasets.migrations.ts
    hash: 9ad0d640257c819712e70979ef2a204903768e9dd7ea209e5848910da11e4f5e
sources_digest: 31e11a4d2bd2a90c3b81b28c9d3f92d06f798be9442378f157e24e5d2e375cca
links:
  - to: dataset-resolution-pipeline
    relation: produces
    description: >-
      Latest and migrated dataset identifiers feed into endpoint resolution for
      API requests
  - to: dataview-url-workspace
    relation: uses
    description: >-
      Migrations apply transformations to serialized dataview configurations
      during URL parsing
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Centralized management of versioned VMS (Vessel Monitoring System) dataset identifiers and their backward-compatible migrations across multiple countries. Provides authoritative lookups for fishing data (identity, fishing effort, presence) keyed by country codes while handling version pinning and legacy format transitions.

## Related

- produces [[dataset-resolution-pipeline]] — Latest and migrated dataset identifiers feed into endpoint resolution for API requests
- uses [[dataview-url-workspace]] — Migrations apply transformations to serialized dataview configurations during URL parsing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
