---
name: ESLint Configuration Delegation
slug: eslint-configuration-delegation
type: concept
sources:
  - path: libs/deck-layers/eslint.config.js
    hash: f4b8d65ebbc93fe43ef6ba67d31c4a5a7e461dadba54eadb8263a58bea75dc53
  - path: libs/ui-components/eslint.config.js
    hash: f4b8d65ebbc93fe43ef6ba67d31c4a5a7e461dadba54eadb8263a58bea75dc53
sources_digest: 6799aaaae457f96c8b7c96c71e8188e9662d80a943111182e7008d817a9a986f
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Monorepo-wide linting consistency achieved by delegating library-level ESLint config to root configuration. libs/ui-components/eslint.config.js exports root config, preventing package-specific overrides and ensuring uniform code style across the workspace. This centralized approach reduces configuration duplication but prevents library-specific lint customizations unless root config provides conditional logic.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
