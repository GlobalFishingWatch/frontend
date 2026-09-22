---
name: Shared ESLint configuration pattern
slug: shared-eslint-configuration-pattern
type: concept
sources:
  - path: apps/image-labeler/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
  - path: apps/platform-e2e/eslint.config.js
    hash: 7e22e29146cdc143db6ff08c2f585c9a112e6058fde5483d66cfd203cc13337c
sources_digest: 28c1f35d0fbe041c46016551c4e995f7a8726fd8d887502ee97174b032644ea6
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Modular linting setup used consistently across apps (data-download-portal, image-labeler, platform-e2e). Each app's eslint.config.js imports appPackageJsonConfig from @globalfishingwatch/linting/nx (shared org-wide standards) and merges it with root config via spread operator, allowing global rules precedence before app-specific validation. This pattern maintains consistent code quality while accommodating app-level customizations without duplication.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
