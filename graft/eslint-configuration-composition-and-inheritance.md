---
name: ESLint configuration composition and inheritance
slug: eslint-configuration-composition-and-inheritance
type: concept
sources:
  - path: linting/index.js
    hash: 18188b008ff026dd16b79275ac5ec1fef742af9af657de0819eeb2c3c26cd946
  - path: linting/legacy.js
    hash: 5e4702664194ddbb1c4e96c5e1f61ccb39530c1beff963ad6c310bd712b7fdb6
  - path: linting/lib.js
    hash: bd910b44645e0783a837960786535f981020f4f628a51d8abf7a5797e715aea6
  - path: linting/nx.js
    hash: 8dc9e2c5783d77604777dde6039668bce09dad6f05c4f4c46e3fb22d1ea64419
  - path: linting/prettier.js
    hash: 837f10d27c77867a5d7410b58521dec64ceb51b2c06b3a6575772dde85d0c73c
  - path: linting/stylelint.js
    hash: 9d625923fc8a3693f54e3f79fcc87702b1cf5c7e854ed7aa2d8ab7029d3ae6e6
sources_digest: 67d0aa2ae9a78c995b80b981675c6eaed68e9cad1684a5bd9ce8eb5c2fdde467
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Multi-layered ESLint configuration strategy: lib.js defines core reusable config with import ordering, TypeScript rules, and plugin integration; index.js exports all configurations (repoConfig alias, cjsRequireConfig, nodeScriptsConfig, packageJsonConfig, routeFilesConfig) for consumers to cherry-pick or combine; legacy.js provides backward-compatible config for existing codebases; nx.js adds monorepo-specific module boundary enforcement. Design enables shared base rules across projects while allowing contextual customization. Prettier integration (prettier.js) applied uniformly for code formatting; stylelint.js handles CSS separately.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
