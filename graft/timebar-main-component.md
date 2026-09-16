---
name: Timebar Main Component
slug: timebar-main-component
type: file
sources:
  - path: libs/timebar/src/timebar.tsx
    hash: 943565a7d2c1d31790041c0f420b66a5764c029195c8610cf79f06fa8c8969a7
sources_digest: 7f9f957b0af6ffb159441d93b26355611455ac3899d5cbc51eb05063ac5b8d84
links:
  - to: bookmark-persistence-pattern
    relation: configures
    description: >-
      Exposes onBookmarkChange callback through context to allow bookmark
      components to persist selected ranges
  - to: event-tracking-constants
    relation: depends_on
    description: >-
      Uses EVENT_SOURCE and EVENT_INTERVAL_SOURCE to tag all state changes with
      user action metadata for telemetry
  - to: playback-control-system
    relation: configures
    description: >-
      Supplies absolute bounds, intervals, and notifyChange callback through
      TimebarContext for playback stepping and animation
  - to: time-range-state-management
    relation: uses
    description: >-
      Delegates internal state tracking and echo-buffer logic to useTimebarRange
      hook to prevent feedback loops from parent prop updates
  - to: timeline-context-system
    relation: configures
    description: >-
      Provides TimelineContextProps to descendant components, enabling drag
      handlers and charts to coordinate visualization
generator:
  version: 1
covers:
  - symbol: getRangeMs
    kind: function
    at: 'libs/timebar/src/timebar.tsx:L34-L38'
  - symbol: TimebarChangeSource
    kind: type
    at: 'libs/timebar/src/timebar.tsx:L40-L40'
  - symbol: TimebarChangeEvent
    kind: type
    at: 'libs/timebar/src/timebar.tsx:L42-L47'
  - symbol: TimebarProps
    kind: type
    at: 'libs/timebar/src/timebar.tsx:L49-L69'
  - symbol: Timebar
    kind: function
    at: 'libs/timebar/src/timebar.tsx:L71-L180'
---

<!-- context:generated:start -->

## Summary

Root composable React component that orchestrates all timebar features (playback, interval selection, charts, bookmarks) through compound component API and TimebarContext. Manages time range state via useTimebarRange hook, enforces min/max duration constraints, and notifies parent of changes with source tracking via EVENT_SOURCE.

## Related

- configures [[bookmark-persistence-pattern]] — Exposes onBookmarkChange callback through context to allow bookmark components to persist selected ranges
- depends on [[event-tracking-constants]] — Uses EVENT_SOURCE and EVENT_INTERVAL_SOURCE to tag all state changes with user action metadata for telemetry
- configures [[playback-control-system]] — Supplies absolute bounds, intervals, and notifyChange callback through TimebarContext for playback stepping and animation
- uses [[time-range-state-management]] — Delegates internal state tracking and echo-buffer logic to useTimebarRange hook to prevent feedback loops from parent prop updates
- configures [[timeline-context-system]] — Provides TimelineContextProps to descendant components, enabling drag handlers and charts to coordinate visualization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
