---
name: Image Labeler type definitions
slug: image-labeler-type-definitions
type: file
sources:
  - path: apps/image-labeler/src/types/index.ts
    hash: 7c2b7f53717b3929a9433a8e925b6136c3b592df9f09c94c95a02217784d7d9f
sources_digest: d881eb03349d74261583bf61826c8a4919ffdfd5ad4ad3214861eaa8e02db484
links:
  - to: image-labeler-application-bootstrap-and-routing
    relation: uses
    description: >-
      Routes use ProjectSearchState; components import LabellingProject and
      LabellingTask for type safety
  - to: image-labeler-redux-api-layer
    relation: uses
    description: >-
      API endpoints and mutations accept/return LabellingProject and
      LabellingTask types
generator:
  version: 1
covers:
  - symbol: LabellingProject
    kind: type
    at: 'apps/image-labeler/src/types/index.ts:L1-L9'
  - symbol: LabellingTask
    kind: type
    at: 'apps/image-labeler/src/types/index.ts:L11-L16'
---

<!-- context:generated:start -->

## Summary

Core TypeScript type contracts for the application data model. LabellingProject couples BigQuery (bqQuery, bqTable) and GCS (gcsThumbnails) configuration with project metadata (name, labels, scale). LabellingTask represents individual work items with required ID, associated images, applicable labels, and arbitrary metadata. Optional ID on Project suggests client-side creation before persistence; required ID on Task implies server generation.

## Related

- uses [[image-labeler-application-bootstrap-and-routing]] — Routes use ProjectSearchState; components import LabellingProject and LabellingTask for type safety
- uses [[image-labeler-redux-api-layer]] — API endpoints and mutations accept/return LabellingProject and LabellingTask types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
