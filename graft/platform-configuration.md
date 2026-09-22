---
name: Platform Configuration
slug: platform-configuration
type: system
sources:
  - path: apps/platform/config/index.ts
    hash: d606df6b5b20299303972937f1293482184958efbf5d062ad60d49bdb04eea87
  - path: apps/platform/config/map/app.ts
    hash: 95b45248aebbf0fbdc0385f09999ae234562feb5ff6d96ee3931f00feff17080
  - path: apps/platform/config/map/datasets.ts
    hash: 5297207b9ab998ab8a09d383e6300d9a69083484078af01b13df2cd5193fffaa
  - path: apps/platform/config/map/dataviews.ts
    hash: 983973c427a4bf7b4723e89070d937f741ec73a6a9226dde63dcc5287cdfe2e9
  - path: apps/platform/config/map/workspaces.ts
    hash: 23a06bb5b52f2e2998a5a2cdd175bbad009154b15f20c034627426c3b6ba6427
  - path: apps/platform/config/routes.ts
    hash: 3325e5685a60204780fe683dfa2e4d2e8aafb23abe6d4f3baedf318501c07350
sources_digest: 147b0a4b2daf96df38860e161cb5f8717577ea5629d7d9b7de55a348329dbd9f
links:
  - to: map-dataview-registry
    relation: uses
    description: >-
      dataviews.ts exports slug constants that are consumed by dataview-registry
      and layer-library modules to populate map layer catalogs
  - to: platform-client-initialization
    relation: configures
    description: >-
      Configuration values (feature flags, routes, workspaces) influence client
      initialization and may be injected via Vite environment variables
  - to: route-synchronization-invariant
    relation: implements
    description: >-
      routes.ts maintains strict 1:1 relationship between URL patterns and Redux
      route type identifiers, auto-generating ROUTE_TYPES to eliminate manual
      sync risk
  - to: workspace-layer-library-defaults
    relation: produces
    description: >-
      Configuration constants (routes, workspaces, dataset identifiers) are
      consumed by default workspace and layer library modules to seed map state
generator:
  version: 1
covers:
  - symbol: WorkspaceCategory
    kind: type
    at: 'apps/platform/config/map/workspaces.ts:L9-L9'
  - symbol: RoutePathKey
    kind: type
    at: 'apps/platform/config/routes.ts:L31-L31'
  - symbol: RoutePathValues
    kind: type
    at: 'apps/platform/config/routes.ts:L32-L32'
  - symbol: ROUTE_TYPES
    kind: type
    at: 'apps/platform/config/routes.ts:L35-L35'
---

<!-- context:generated:start -->

## Summary

Centralized, single-source-of-truth configuration module that exports routes, map viewport settings, dataset identifiers, dataview slugs (layer definitions), workspace categories, and environment-dependent settings. Prevents drift between navigation routing, state management type identifiers, and data layer references through const objects and type generation.

## Related

- uses [[map-dataview-registry]] — dataviews.ts exports slug constants that are consumed by dataview-registry and layer-library modules to populate map layer catalogs
- configures [[platform-client-initialization]] — Configuration values (feature flags, routes, workspaces) influence client initialization and may be injected via Vite environment variables
- implements [[route-synchronization-invariant]] — routes.ts maintains strict 1:1 relationship between URL patterns and Redux route type identifiers, auto-generating ROUTE_TYPES to eliminate manual sync risk
- produces [[workspace-layer-library-defaults]] — Configuration constants (routes, workspaces, dataset identifiers) are consumed by default workspace and layer library modules to seed map state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
