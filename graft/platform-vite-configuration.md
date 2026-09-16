---
name: Platform Vite Configuration
slug: platform-vite-configuration
type: file
sources:
  - path: apps/platform/vite.config.ts
    hash: 6f16a8a678a8de14dd75a462c2c208d87c1f0a73f265853168c6a8fbe2600267
sources_digest: 281c502a1e48cf19d527fc0a9bd0957795b5cda3e897ded82758818c5bf918b5
links:
  - to: platform-app-utilities
    relation: configures
    description: >-
      Vite configuration determines how utilities are bundled, cached, and
      loaded in different environments
generator:
  version: 1
covers:
  - symbol: staticRouteRules
    kind: function
    at: 'apps/platform/vite.config.ts:L25-L34'
  - symbol: hotUpdate
    kind: method
    at: 'apps/platform/vite.config.ts:L81-L86'
  - symbol: manualChunks
    kind: method
    at: 'apps/platform/vite.config.ts:L154-L179'
---

<!-- context:generated:start -->

## Summary

Orchestrates build, development, and SSR setup for the platform app using TanStack Start framework with careful attention to module initialization order, vendor chunk splitting, and browser compatibility. Addresses recharts initialization failures and Translate compatibility by preventing chunk reordering and excluding browser-only packages from SSR.

## Related

- configures [[platform-app-utilities]] — Vite configuration determines how utilities are bundled, cached, and loaded in different environments

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
