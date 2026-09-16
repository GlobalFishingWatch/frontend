---
name: Timebar Utilities & Helpers
slug: timebar-utilities-helpers
type: system
sources:
  - path: libs/timebar/src/utils/create-guarded-context.ts
    hash: ce548c4a6e43b4721191b9da2d328b63ece904a0722a546aaa9367f9fff53f53
  - path: libs/timebar/src/utils/index.ts
    hash: 6a0ef3ef596dd784170d1e45895bbf72bbbcd27f8b3ba7866a5314b92430b91b
  - path: libs/timebar/src/utils/use-resizable-height.ts
    hash: 73b3ce322f0459723db9264617aaf898b1032caaa3b049de1323373490fc839e
sources_digest: 85c418e70edca1f659f1860505ffc10d59456dbc4a96fff4681937810588b577
links:
  - to: react-context-safety-pattern
    relation: produces
    description: >-
      createGuardedContext factory creates typed contexts with null-safety
      checks; prevents silent failures when hooks are called outside their
      provider boundary
  - to: timebar-timeline-interaction-system
    relation: implements
    description: >-
      Provides clampToAbsoluteBoundaries (enforces min/max date bounds while
      preserving duration), stickToClosestUnit (snaps to calendar units), and
      time delta functions (getDeltaMs, getDeltaDays) required by drag handlers
generator:
  version: 1
covers:
  - symbol: createGuardedContext
    kind: function
    at: 'libs/timebar/src/utils/create-guarded-context.ts:L3-L13'
  - symbol: useGuardedContext
    kind: function
    at: 'libs/timebar/src/utils/create-guarded-context.ts:L5-L11'
  - symbol: useLatest
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L9-L15'
  - symbol: getTime
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L17-L17'
  - symbol: getDeltaMs
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L19-L19'
  - symbol: getDeltaDays
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L20-L21'
  - symbol: isMoreThanADay
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L22-L22'
  - symbol: getDefaultFormat
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L23-L24'
  - symbol: YearBoundsOptions
    kind: type
    at: 'libs/timebar/src/utils/index.ts:L26-L29'
  - symbol: isYearInBounds
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L31-L36'
  - symbol: getHumanizedDates
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L38-L46'
  - symbol: getLastX
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L48-L57'
  - symbol: stickToClosestUnit
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L58-L66'
  - symbol: clampToAbsoluteBoundaries
    kind: function
    at: 'libs/timebar/src/utils/index.ts:L68-L95'
  - symbol: getStoredHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L13-L21'
  - symbol: setStoredHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L23-L29'
  - symbol: useResizableHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L35-L87'
---

<!-- context:generated:start -->

## Summary

Centralized collection of date/time manipulation, formatting, and boundary management utilities built on Luxon and data-transforms library. Provides time delta calculations, locale-aware formatting, year validation, calendar unit snapping, and absolute boundary clamping that preserve interval duration—all foundational to timeline range resolution and visual feedback.

## Related

- produces [[react-context-safety-pattern]] — createGuardedContext factory creates typed contexts with null-safety checks; prevents silent failures when hooks are called outside their provider boundary
- implements [[timebar-timeline-interaction-system]] — Provides clampToAbsoluteBoundaries (enforces min/max date bounds while preserving duration), stickToClosestUnit (snaps to calendar units), and time delta functions (getDeltaMs, getDeltaDays) required by drag handlers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
