---
name: ESLint Architecture Rules
slug: eslint-architecture-rules
type: file
sources:
  - path: apps/platform/eslint.config.js
    hash: 1e5e53c2f354ce29d52184e7aa67214493b01b4c4ac806eb1ddedaad3c524962
sources_digest: 3ebdf9dbf571c593a6f7edff906afc1ad5ebf57adbbd23af50a1fad5a12686bb
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Custom linting rules enforcing architectural patterns: circular dependency detection in Redux selectors (to prevent SSR bundle issues) and restricting barrel imports in UI libraries (to enable tree-shaking and reduce bundle size).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
