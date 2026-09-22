---
name: Ruler Measurement System
slug: ruler-measurement-system
type: system
sources:
  - path: apps/platform/features/_map/map/overlays/rulers/rulers-drag.hooks.ts
    hash: 0cb518ebac2920b15e720d45c797c6a816661ecf180a890566e9cf56bfb9a13d
  - path: apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts
    hash: f076fa01134fafda43e90ef30550d5c15c10211a7abd22530328c7b51e5ae4b6
sources_digest: aeacf9d79bc4cd4be415428bd8471791c15b905ac294e9f9dedc2763c4508826
links:
  - to: map-popup-system
    relation: depends_on
    description: Rulers integrate with popups for coordinate display
generator:
  version: 1
covers:
  - symbol: useMapRulersDrag
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/rulers/rulers-drag.hooks.ts:L15-L66
  - symbol: useRulers
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L17-L130'
  - symbol: useMapRulerInstance
    kind: function
    at: 'apps/platform/features/_map/map/overlays/rulers/rulers.hooks.ts:L132-L143'
---

<!-- context:generated:start -->

## Summary

Enables users to draw and interactively edit distance measurement rulers on the map. Manages ruler lifecycle via useRulers hook with creation (capturing start/end points on click), real-time editing during hover (throttled at 16ms for frame-rate rendering), deletion, and visibility toggling. RulersLayer deck.gl component combines persisted rulers with in-progress editing ruler. Ruler identity uses timestamps, and state persists to URL query parameters via useReplaceQueryParams. Drag operations on ruler endpoints use deck.gl picking payloads with RulerPickingObject metadata.

## Related

- depends on [[map-popup-system]] — Rulers integrate with popups for coordinate display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
