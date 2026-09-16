---
name: ESLint configuration core
slug: eslint-configuration-core
type: system
sources:
  - path: linting/index.js
    hash: 18188b008ff026dd16b79275ac5ec1fef742af9af657de0819eeb2c3c26cd946
  - path: linting/lib.js
    hash: bd910b44645e0783a837960786535f981020f4f628a51d8abf7a5797e715aea6
sources_digest: ac854ee229349587cee63c0d49af3dc510d5254162b5478e9846f5f3de28b309
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Shared ESLint ruleset for TypeScript/React monorepos. lib.js exports the main `config` flat config with integrated support for eslint, typescript-eslint, React (reactPlugin, reactHooksPlugin, reactRefreshPlugin), imports (importPlugin, simpleImportSort), and accessibility (jsxA11yPlugin) via prettier integration. Enforces structured import ordering (builtins → externals → internal paths → styles) and strict TypeScript rules with flexibility on return types and any usage. Exports specialized configs: routeFilesConfig disables react-refresh for TanStack Router routes, nodeScriptsConfig provides Node globals, cjsRequireConfig permits require in .cjs files, packageJsonConfig applies workspace-aware package.json linting. index.js re-exports all configurations for consumer choice. design assumption: base import rules (no-unresolved, named, namespace) disabled to avoid duplication with TypeScript resolution.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
