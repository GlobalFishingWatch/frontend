---
name: Lazy Control Loading
slug: lazy-control-loading
type: concept
sources:
  - path: apps/platform/features/_map/map/controls/MapControls.tsx
    hash: 35b7fd683e627f93cd5a9c398cc3532d733bc18538e4fe74766d224dbcae0b7a
sources_digest: c377a80733bbcb6d856afce3c7975c2d0d2fdaebc5c045de0be813cbf68a96c6
links:
  - to: map-controls-system
    relation: configures
    description: Applies code-splitting and Suspense wrapping to control children
generator:
  version: 1
covers:
  - symbol: MapControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapControls.tsx:L48-L220'
---

<!-- context:generated:start -->

## Summary

Performance optimization where heavy map control components (MapSearch, Rulers, AnnotationsControl, Screenshot, MiniGlobe) are code-split and lazily loaded via Suspense boundaries. Prevents bundle bloat for non-map pages and defers initialization cost until map is actually rendered.

## Related

- configures [[map-controls-system]] — Applies code-splitting and Suspense wrapping to control children

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
