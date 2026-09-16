---
name: Nx monorepo linting
slug: nx-monorepo-linting
type: file
sources:
  - path: linting/nx.js
    hash: 8dc9e2c5783d77604777dde6039668bce09dad6f05c4f4c46e3fb22d1ea64419
sources_digest: f974fc04136ca4b5f2a095bd6d47b2bb200468f6c7f7b522c643d08051e7ce34
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

ESLint rules for Nx workspace module boundaries and dependency enforcement. Exports packageJsonDependencyChecksConfig (validates workspace dependencies via @nx/dependency-checks with ignores for build configs, tests, scripts, and known false positives), appPackageJsonConfig (root package.json variant disabling missing dependency checks), and moduleBoundariesConfig (enforces @nx/enforce-module-boundaries: apps and e2e tests can import from libs; Node subpath imports marked with #* are permitted). Assumes tagged project structure (app, lib, e2e tags) and workspace bundles like url-workspace needing devDependency constraints.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
