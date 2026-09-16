---
name: Lazy Workspace Reset Pattern
slug: lazy-workspace-reset-pattern
type: concept
sources:
  - path: apps/platform/features/nav/nav.actions.ts
    hash: 956dd886fbe016581a50f3ece5cef358303fc0d29ec8b7d4d11ee2d3b8a94cdb
  - path: apps/platform/features/nav/nav.hooks.ts
    hash: 0a8ab7b144796e374e1ecc575c140b47b6509d0792df7ba1e1caad964e040770
sources_digest: 4802d2d5d59a5970041fbf0cdf0865b088d93ece87f800d92658b5f93a0f863e
links:
  - to: navigation-system
    relation: part_of
    description: >-
      nav.actions defines the action that nav.hooks dispatches; dependent slices
      react via extraReducers
generator:
  version: 1
covers:
  - symbol: useOpenFeedbackModal
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L38-L47'
  - symbol: useNavLinkContext
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L50-L112'
  - symbol: useIsNavItemActive
    kind: function
    at: 'apps/platform/features/nav/nav.hooks.ts:L115-L150'
---

<!-- context:generated:start -->

## Summary

Decouples navigation from dependent slices by dispatching Redux actions (workspaceTabClicked) instead of direct function calls. Allows workspace, search, and report slices to independently react via extraReducers without forcing their imports into the always-rendered nav component, keeping the dependency graph lightweight.

## Related

- part of [[navigation-system]] — nav.actions defines the action that nav.hooks dispatches; dependent slices react via extraReducers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
