---
name: Environment & Path Configuration
slug: environment-path-configuration
type: file
sources:
  - path: libs/deck-loaders/src/loaders.config.ts
    hash: e01269a370492da5ef1cad9c02bdbaffd32bb3ff5269fcc436050e56727003de
sources_digest: b5cbacd4dc56691cfca30773674d807d30c632b69e8d74bc2ec08de2fd014c8d
links: []
generator:
  version: 1
covers:
  - symbol: getEnv
    kind: function
    at: 'libs/deck-loaders/src/loaders.config.ts:L3-L11'
---

<!-- context:generated:start -->

## Summary

Provides environment-aware path resolution for deck-loaders via getEnv (checks Vite import.meta.env first, falls back to Node process.env) and PATH_BASENAME (normalized base path from VITE_PUBLIC_URL or NEXT_PUBLIC_URL with fallback /platform/). Enables dual-environment operation in Vite frontend builds and Next.js applications with consistent URL construction.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
