---
name: Monorepo workspace dependency and boundary enforcement
slug: monorepo-workspace-dependency-and-boundary-enforcement
type: concept
sources:
  - path: linting/nx.js
    hash: 8dc9e2c5783d77604777dde6039668bce09dad6f05c4f4c46e3fb22d1ea64419
  - path: scripts/check-store-graph.mjs
    hash: 7439d8c92b23e9c5045e1972641d46c8e5a54a35d57a9863f8458d82706aa492
sources_digest: b3fbca6c4907bd1225c0393d0f0b77a7bb83d828da2cee24e109fe36df9850c3
links: []
generator:
  version: 1
covers:
  - symbol: readWorkspacePackages
    kind: function
    at: 'scripts/check-store-graph.mjs:L137-L165'
  - symbol: sourceTargetFor
    kind: function
    at: 'scripts/check-store-graph.mjs:L179-L208'
  - symbol: resolveWorkspaceSpecifier
    kind: function
    at: 'scripts/check-store-graph.mjs:L214-L251'
  - symbol: fail
    kind: function
    at: 'scripts/check-store-graph.mjs:L221-L224'
  - symbol: resolveFile
    kind: function
    at: 'scripts/check-store-graph.mjs:L279-L289'
  - symbol: resolveSpecifier
    kind: function
    at: 'scripts/check-store-graph.mjs:L297-L327'
  - symbol: runtimeSpecifiers
    kind: function
    at: 'scripts/check-store-graph.mjs:L330-L370'
  - symbol: walk
    kind: function
    at: 'scripts/check-store-graph.mjs:L378-L422'
  - symbol: addImporter
    kind: function
    at: 'scripts/check-store-graph.mjs:L387-L390'
  - symbol: chainTo
    kind: function
    at: 'scripts/check-store-graph.mjs:L425-L433'
---

<!-- context:generated:start -->

## Summary

Nx-based linting (nx.js and check-store-graph.mjs) enforces strict import boundaries and dependency hygiene: @nx/enforce-module-boundaries prevents inappropriate cross-project imports (apps/e2e can import from libs, but libs cannot circular-depend); @nx/dependency-checks validates package.json declarations against actual imports; check-store-graph.mjs walks runtime graphs to detect heavyweight transitive dependencies and enforce module budgets (120 for root+eager, 300 for platform shell). Design recognizes that module count growth is primary enforcement lever because blocklist (FORBIDDEN packages) only catches known problems. Workspaces resolved to source not dist to catch pre-build issues.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
