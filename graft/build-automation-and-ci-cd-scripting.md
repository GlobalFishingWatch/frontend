---
name: Build automation and CI/CD scripting
slug: build-automation-and-ci-cd-scripting
type: concept
sources:
  - path: scripts/check-store-graph.mjs
    hash: 7439d8c92b23e9c5045e1972641d46c8e5a54a35d57a9863f8458d82706aa492
  - path: scripts/clean-lib-dist.sh
    hash: 705688b4880ccb77cb5a39fa0056cd3d7af6f4ec0d04c11dceed89d9f2d1dc07
  - path: scripts/generate-certificate.sh
    hash: 57b8c15beefc0643dfb8a33cbda9e605bab06f6e3f44d8dfba25b372a360bf0b
  - path: scripts/reachable-features.mjs
    hash: a7b6b1b10bb3021ee3eb574f6c07ad7077f3f71683ee7d00593e999d51d6423a
  - path: scripts/test-ci-build-platform.sh
    hash: 3efb3861fc464408dec4909a0ca0d2178ad9a3c26a790eb52e23997337b6d8c7
sources_digest: 6490a4f0a8cdd253d6fc09825cf767ef131a574e6e36c8f471d56347e5cba54e
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
  - symbol: rf
    kind: function
    at: 'scripts/reachable-features.mjs:L64-L72'
  - symbol: resolveSpec
    kind: function
    at: 'scripts/reachable-features.mjs:L73-L78'
  - symbol: specs
    kind: function
    at: 'scripts/reachable-features.mjs:L79-L113'
---

<!-- context:generated:start -->

## Summary

Bash and Node.js scripts supporting monorepo development and CI workflows: clean-lib-dist.sh removes stale TypeScript artifacts; generate-certificate.sh provisions self-signed certs for local dev; test-ci-build-platform.sh reproduces GitHub Actions Docker builds locally; check-store-graph.mjs enforces runtime bundle budgets; reachable-features.mjs analyzes dependency graphs. Pattern reflects DevOps concerns around artifact management, local reproducibility of CI processes, and automated quality gates. Scripts assume specific workspace structure (/libs, apps/platform, .github/apps config) and external tool availability (Docker, Python, GCP Secret Manager).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
