---
name: Platform Layout Routes
slug: platform-layout-routes
type: system
sources:
  - path: apps/platform/routes/_platform.tsx
    hash: 2066eaf368c1d8a094e31444821650d390f717e1d4b1c2de19a9dfaa26e1d915
  - path: apps/platform/routes/_platform/_content.tsx
    hash: e4a7cab8929e903477610af5beaf46fee9801ce7e15f536d306c7ea5959ceae4
  - path: apps/platform/routes/_platform/_map.tsx
    hash: 23f6d709b659ebbe3c01cbacbe085a43a5522902ab972bfb9993fab10151ce87
sources_digest: ea22130c1e324948eeed4e2f666c19cb30927b80691328ffad301ec308ed37d6
links:
  - to: root-route
    relation: part_of
    description: These routes are nested children of __root.tsx
  - to: route-configuration
    relation: uses
    description: Routes validate search params using validateRootSearchParams
generator:
  version: 1
covers:
  - symbol: PlatformShell
    kind: function
    at: 'apps/platform/routes/_platform.tsx:L11-L18'
---

<!-- context:generated:start -->

## Summary

Route structure establishing the platform shell hierarchy: _platform provides Redux store via useAppStore and wraps in PlatformLayout; _content pathless layout for content-only pages (user, vessel-search); _map pathless layout wrapping map-dependent features in MapLayout. Design: _content and _map are pathless layout groups allowing child routes to nest without adding to URL, preserving clean URLs while providing consistent containers.

## Related

- part of [[root-route]] — These routes are nested children of __root.tsx
- uses [[route-configuration]] — Routes validate search params using validateRootSearchParams

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
