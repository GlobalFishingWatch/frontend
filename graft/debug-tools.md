---
name: Debug Tools
slug: debug-tools
type: system
sources:
  - path: apps/platform/features/debug/debug.hooks.tsx
    hash: 48d14692a1da17194b80acf2407637f4d222a6c80b66d48f031c67cfc0c6744b
  - path: apps/platform/features/debug/debug.slice.ts
    hash: 362f65593b98bcab93c0a63008b534f4e3ba1f5dee0351c35087ef4f96f4d426
  - path: apps/platform/features/debug/DebugDataviews.tsx
    hash: cbfaa732e53588bda157f3696351b57d6382aba5a6360c1330dd966b533cf229
  - path: apps/platform/features/debug/DebugFeatureFlags.tsx
    hash: 61390cba55c5b7699351fe3aa252e1dccc9e0f029cad1ea8980dd7f9700a0f6f
sources_digest: 588172b81cc6c922922f72a7ec8fd9b7618593cf153d7052b2f83f4bf459c1bf
links:
  - to: data-layer-api
    relation: configures
    description: >-
      Debug options control track thinning strategy, tile visualization, and
      dataset hash inclusion
  - to: router-integration
    relation: uses
    description: >-
      DebugFeatureFlags syncs longline sets insight flag to URL via
      useReplaceQueryParams
  - to: workspace-map-data
    relation: uses
    description: >-
      selectIsGFWDeveloper and workspace selectors determine which debug
      controls are visible
generator:
  version: 1
covers:
  - symbol: DebugDataviews
    kind: function
    at: 'apps/platform/features/debug/DebugDataviews.tsx:L20-L65'
  - symbol: DebugFeatureFlags
    kind: function
    at: 'apps/platform/features/debug/DebugFeatureFlags.tsx:L26-L148'
  - symbol: useFeatureFlagsToast
    kind: function
    at: 'apps/platform/features/debug/debug.hooks.tsx:L9-L36'
  - symbol: FeatureFlag
    kind: enum
    at: 'apps/platform/features/debug/debug.slice.ts:L6-L8'
  - symbol: DebugOption
    kind: enum
    at: 'apps/platform/features/debug/debug.slice.ts:L10-L19'
  - symbol: DebugOptions
    kind: type
    at: 'apps/platform/features/debug/debug.slice.ts:L23-L23'
  - symbol: DebugState
    kind: interface
    at: 'apps/platform/features/debug/debug.slice.ts:L25-L29'
  - symbol: selectDebugActive
    kind: function
    at: 'apps/platform/features/debug/debug.slice.ts:L72-L72'
  - symbol: selectDebugOptions
    kind: function
    at: 'apps/platform/features/debug/debug.slice.ts:L73-L73'
  - symbol: selectFeatureFlags
    kind: function
    at: 'apps/platform/features/debug/debug.slice.ts:L74-L74'
---

<!-- context:generated:start -->

## Summary

Redux slice and UI components for toggling debug options (tile stats, vessel modes, track thinning, data hashing) and experimental feature flags at runtime. Restricts developer features (dataset debugging, feature flags UI) to GFW developers via role-based checks. Toast notifications warn when experimental features are active unless debug mode disabled.

## Related

- configures [[data-layer-api]] — Debug options control track thinning strategy, tile visualization, and dataset hash inclusion
- uses [[router-integration]] — DebugFeatureFlags syncs longline sets insight flag to URL via useReplaceQueryParams
- uses [[workspace-map-data]] — selectIsGFWDeveloper and workspace selectors determine which debug controls are visible

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
