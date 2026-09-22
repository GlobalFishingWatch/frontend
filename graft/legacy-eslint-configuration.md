---
name: Legacy ESLint configuration
slug: legacy-eslint-configuration
type: file
sources:
  - path: linting/legacy.js
    hash: 5e4702664194ddbb1c4e96c5e1f61ccb39530c1beff963ad6c310bd712b7fdb6
sources_digest: 268d9ac635fbe067e3eccfe963c72989f3cfd964f80a70f688b76f9bbb778cca
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

ESLint config for legacy TypeScript/React codebases using Nx. Extends react-app and prettier with @typescript-eslint/parser and strict import ordering via import/order (groups: features, store, common, components as internal; @globalfishingwatch/** as external). Disables many strict TypeScript rules (no-explicit-any, explicit-function-return-type, explicit-module-boundary-types) for pragmatic linting focused on import structure. Enables @typescript-eslint/no-use-before-define to catch legitimate issues. Multiple TODO comments indicate ongoing remediation for plugin conflicts and stricter standards. @nx/dependency-checks enforces monorepo coherence while excluding Vite configs.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
