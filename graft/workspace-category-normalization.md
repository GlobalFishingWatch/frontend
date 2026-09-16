---
name: Workspace Category Normalization
slug: workspace-category-normalization
type: concept
sources:
  - path: apps/platform/routes/_platform/_map/map/$category/index.tsx
    hash: 3a8e4217f6b6202a7ed7cd4ef9d326b4d054cfa6e53930834e795f58d0b19007
sources_digest: de0b1c2421482536e7c39303efc210aadd9eb993cdc1333bb56704f02d9a83dd
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Route parameter normalization pattern where category slugs are lowercased before metadata lookup, enabling case-insensitive URL handling (e.g., /map/Social/ -> /map/social/) while maintaining type safety through WorkspaceCategoryDescriptionKey type.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
