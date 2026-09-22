---
name: Platform Vitest Configuration
slug: platform-vitest-configuration
type: file
sources:
  - path: apps/platform/vitest.config.ts
    hash: 48131d80dc0bf4fe751e01c579fe923e7123bc5287a2e3bcaa0463ed6dab9c9e
sources_digest: f05d7ddf25d869a9f6344beae9d1c3dceab1d2db5d4abd696aafd2f1ca647ad5
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Configures Vitest for browser-based component testing with Playwright across Chromium, Firefox, and WebKit, managing path aliases and monorepo resolution to prevent pre-bundling errors. Explicitly redefines resolution instead of extending vite.config because Vitest overrides rather than merges parent Vite settings.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
