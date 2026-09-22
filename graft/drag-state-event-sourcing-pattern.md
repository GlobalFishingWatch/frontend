---
name: Drag State & Event Sourcing Pattern
slug: drag-state-event-sourcing-pattern
type: concept
sources:
  - path: libs/timebar/src/timeline/timeline.interaction.spec.tsx
    hash: 839fa9b2ac4de9b53e602a6b7d7cc8a8f251513bc59fe7cc092ee391b5843dca
  - path: libs/timebar/src/timeline/use-pointer-interaction.ts
    hash: e0f678a23178b86cc4139759b56e510fe01788b954ffa08b71ed8be50fc93498
sources_digest: 3923c81ba37961ca5c681b89e3d167dc8271f507f7f56977b781601b7302c89d
links:
  - to: timebar-timeline-interaction-system
    relation: part_of
    description: >-
      Event sourcing allows tests and downstream handlers to verify correct drag
      type emission and distinguish pans from zooms
generator:
  version: 1
covers:
  - symbol: ChangeMock
    kind: type
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L9-L9'
  - symbol: renderTimeline
    kind: function
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L37-L48'
  - symbol: sourcesOf
    kind: function
    at: 'libs/timebar/src/timeline/timeline.interaction.spec.tsx:L50-L50'
  - symbol: Params
    kind: type
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L30-L42'
  - symbol: usePointerInteraction
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L44-L218'
  - symbol: onMouseMoveWindow
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L72-L139'
  - symbol: onMouseUpWindow
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L141-L189'
  - symbol: onInteractionCancel
    kind: function
    at: 'libs/timebar/src/timeline/use-pointer-interaction.ts:L193-L198'
---

<!-- context:generated:start -->

## Summary

Timeline emits change events with explicit drag source classification (SEEK_MOVE during interaction, SEEK_RELEASE on completion) that downstream handlers inspect to determine gesture intent. Drag types include DRAG_INNER for pan (advances time window when dragging left due to inverted direction metaphor), DRAG_START/DRAG_END for edge zoom, and DRAG_ZOOM_IN/DRAG_ZOOM_OUT for zoom gestures. The resolveDragSource utility distinguishes these types based on pixel deltas and handler positions; spurious mousemove without prior mousedown are ignored.

## Related

- part of [[timebar-timeline-interaction-system]] — Event sourcing allows tests and downstream handlers to verify correct drag type emission and distinguish pans from zooms

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
