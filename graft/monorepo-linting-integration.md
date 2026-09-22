---
name: Monorepo Linting Integration
slug: monorepo-linting-integration
type: concept
sources:
  - path: apps/api-portal/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
  - path: apps/data-download-portal/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
sources_digest: 73a913ec43bf9c848333ed5c4a44d3260da8e3c2c0c95dcece86dc9151e987dc
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Both portals use consistent ESLint configuration pattern: importing rootConfig from monorepo root and appPackageJsonConfig from @globalfishingwatch/linting/nx, then spreading both into single array for hierarchical rule application.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
