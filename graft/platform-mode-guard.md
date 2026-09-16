---
name: Platform Mode Guard
slug: platform-mode-guard
type: concept
sources:
  - path: apps/platform/routes/_platform/index.tsx
    hash: 6832057d59a9708ecf51205c02fe5102c05aaab928d39638743ffa7ee2855184
sources_digest: 86a992a56542720f67539ca7b5a9f9875eb004960931398efee1f0578010624b
links: []
generator:
  version: 1
covers:
  - symbol: PlatformLanding
    kind: function
    at: 'apps/platform/routes/_platform/index.tsx:L12-L35'
---

<!-- context:generated:start -->

## Summary

Route-level guard pattern that checks PLATFORM_MODE configuration and redirects to map view if disabled, preventing landing page from appearing in incompatible application modes.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
