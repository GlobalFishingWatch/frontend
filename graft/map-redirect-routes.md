---
name: Map Redirect Routes
slug: map-redirect-routes
type: system
sources:
  - path: apps/platform/routes/_platform/_map/map/report.$reportId.tsx
    hash: 2b65b9a054dc9e6b7183ca62867dbc610db4042a82b18198242ded0f26b0768d
  - path: apps/platform/routes/_platform/_map/map/user.tsx
    hash: 0a9784f32c46d75ed801946844d86ee82dea941290003d41e0b3d8c42ad2c0fb
  - path: apps/platform/routes/_platform/_map/map/vessel-search.tsx
    hash: c108386670d560e1af4363167fccb16c1096d2bb3ae09b0a2fa8dde3c398397e
  - path: apps/platform/routes/_platform/_map/map/vessel.$vesselId.tsx
    hash: d6ef79e6636aef3cc5f4204e9666b7e54df2dbef978bb60de65f1c2c5065dd88
sources_digest: 3591a750a5203a5942db0c7d226b9af38cfde6dc000155a5adb8a02f80236e2b
links:
  - to: route-path-configuration
    relation: depends_on
    description: >-
      All redirects reference ROUTE_PATHS from @platform/config/routes to
      determine canonical redirect targets, ensuring consistency across
      refactoring
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Backwards-compatibility redirect routes that intercept legacy URL patterns (e.g., `/map/report/$id`, `/map/vessel-search`) and permanently redirect to new canonical paths using HTTP 308, preserving query parameters.

## Related

- depends on [[route-path-configuration]] — All redirects reference ROUTE_PATHS from @platform/config/routes to determine canonical redirect targets, ensuring consistency across refactoring

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
