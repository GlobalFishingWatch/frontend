---
name: Dataset Resolution Pipeline
slug: dataset-resolution-pipeline
type: system
sources:
  - path: libs/datasets-client/src/resolve-endpoint.ts
    hash: 3d76f0935253d8a38553901dc181b03ff098621470a81c7b13f27ea421a5851f
sources_digest: 7322bc9edf720e00d6061def6bed6fe6ea6f5513f082560a1859b9bbb789dd07
links:
  - to: dataview-resolution-filtering
    relation: depends_on
    description: Receives resolved dataview instances with merged configs as input
  - to: deck-layer-resource-fetching
    relation: produces
    description: >-
      Generates concrete tile and API resource URLs consumed by layer
      composition
  - to: vms-dataset-registry
    relation: uses
    description: >-
      Consumes dataset identifiers and configuration mappings for endpoint
      construction
generator:
  version: 1
covers:
  - symbol: resolveEndpoint
    kind: function
    at: 'libs/datasets-client/src/resolve-endpoint.ts:L10-L106'
---

<!-- context:generated:start -->

## Summary

Resolves complete API endpoint URLs and dataset configurations from dataview instances by merging dataset metadata, user overrides, and query parameters. Handles type-specific configuration schemas and graceful fallbacks for legacy structures.

## Related

- depends on [[dataview-resolution-filtering]] — Receives resolved dataview instances with merged configs as input
- produces [[deck-layer-resource-fetching]] — Generates concrete tile and API resource URLs consumed by layer composition
- uses [[vms-dataset-registry]] — Consumes dataset identifiers and configuration mappings for endpoint construction

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
