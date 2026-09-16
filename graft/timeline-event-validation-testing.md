---
name: Timeline Event Validation & Testing
slug: timeline-event-validation-testing
type: concept
sources:
  - path: libs/timebar/src/timeline/timeline.interaction.spec.tsx
    hash: 839fa9b2ac4de9b53e602a6b7d7cc8a8f251513bc59fe7cc092ee391b5843dca
sources_digest: 87d3660a6ee067e4581c9da865c05f85b10077240c397e60ba72b7a8f245eedb
links:
  - to: drag-state-event-sourcing-pattern
    relation: validates
    description: >-
      Test suite verifies correct event source emission and ordering to ensure
      drag classification works correctly
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
---

<!-- context:generated:start -->

## Summary

Test suite validates timeline drag interactions by mocking UI component dependencies (Icon, IconButton, Tooltip, Select) and simulating mouse/touch gestures (mousedown, mousemove, mouseup, touchcancel). The sourcesOf utility extracts event sources from onChange mock history to verify correct event sequence (SEEK_MOVE → SEEK_RELEASE). Key validated scenarios include: panning leftward advances time window (counterintuitive direction metaphor), spurious mousemove without mousedown are ignored, and touchcancel properly resets drag state.

## Related

- validates [[drag-state-event-sourcing-pattern]] — Test suite verifies correct event source emission and ordering to ensure drag classification works correctly

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
