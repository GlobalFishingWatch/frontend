---
name: Context Layer Grouping
slug: context-layer-grouping
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/context.ts
    hash: ee5c7de581ec1f970fbd8953b4de95f96136bfc7ff5832398d8ced30897acc8e
sources_digest: bc7859e9d1c8e71a1ccb8af5f42493c0db15afd521ece4fb43e6a7b7eae23009
links:
  - to: dataset-client
    relation: depends_on
    description: Uses datasets-client to find and configure context datasets by type
  - to: user-layer-resolution
    relation: uses
    description: >-
      Coordinates with user layer resolver to configure sublayers for user-drawn
      and user-context geometries
generator:
  version: 1
covers:
  - symbol: resolveDeckContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/context.ts:L14-L57'
---

<!-- context:generated:start -->

## Summary

Groups and merges related context dataviews (polygons, points, tracks) from different dataset sources into unified layer configurations, handling temporal bounds and sublayer organization.

## Related

- depends on [[dataset-client]] — Uses datasets-client to find and configure context datasets by type
- uses [[user-layer-resolution]] — Coordinates with user layer resolver to configure sublayers for user-drawn and user-context geometries

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
