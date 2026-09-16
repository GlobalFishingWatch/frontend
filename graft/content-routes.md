---
name: Content Routes
slug: content-routes
type: system
sources:
  - path: >-
      apps/platform/routes/_platform/_content/help-and-resources/$sectionSlug.{-$itemSlug}.tsx
    hash: b1eb22d8ffcf0272d03a73ede0fa563866298d4dbd8d0a4fb2782848073059b7
  - path: apps/platform/routes/_platform/_content/help-and-resources/index.tsx
    hash: e84bfec0a8aa10a4f07e5af673a1618997a1649941a72944a1303dd2eaf9d741
  - path: apps/platform/routes/_platform/_content/user.tsx
    hash: 374884147bd76e2a93ce3ea6db05dccf4bfa344b8d5dcbe34906fdd54b47a6cc
  - path: apps/platform/routes/_platform/_content/vessel-search.tsx
    hash: 6023840e5707432c2b7c599a52c21f99c7ae80a7016308ca96e292c188e6bae1
sources_digest: 5df475019293b60eff6bb6df0342de6cebe49af70aaaaaa1e5ab4ab7c0e239db
links:
  - to: platform-layout-routes
    relation: part_of
    description: All nested under _platform/_content layout
  - to: seo-and-metadata
    relation: uses
    description: Routes call getRouteHead or getSearchHead for page metadata
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Routes rendered within _content layout for non-map features: user profile (user.tsx), vessel search (vessel-search.tsx), and help hub (help-and-resources/*). Help hub uses optional $itemSlug parameter to distinguish between section index and article detail views via {-$itemSlug} syntax, with beforeLoad validation, loader for content fetching, and dynamic head generation including canonical links.

## Related

- part of [[platform-layout-routes]] — All nested under _platform/_content layout
- uses [[seo-and-metadata]] — Routes call getRouteHead or getSearchHead for page metadata

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
