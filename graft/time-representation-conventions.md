---
name: Time Representation Conventions
slug: time-representation-conventions
type: concept
sources:
  - path: libs/timebar/src/charts/highlighter.tsx
    hash: beeba0123b70fa3f05eae070ce1000f8ce425e59ed6e5e11a7cb809f8183a68d
  - path: libs/timebar/src/components/bookmark.tsx
    hash: 978fac1cd73b6b354bee7633becdb0a049adab8e4741a9f16c67a8150e4e0aa0
  - path: libs/timebar/src/components/playback.utils.ts
    hash: 4db3419fb0996619ee10cee6aa382edf846107ec15dad138ee6a4aaef0004de4
  - path: libs/timebar/src/timebar-range.ts
    hash: 1713134603063764cd064497a620b8688158a12d1b8cd07822844e6bc278cdf7
  - path: libs/timebar/src/timebar.tsx
    hash: 943565a7d2c1d31790041c0f420b66a5764c029195c8610cf79f06fa8c8969a7
sources_digest: fee7159feb3129848c9dd56c369b4b741323e76ccf8feeeb63dfda4b36eae8ed
links:
  - to: chart-rendering-engine
    relation: implements
    description: >-
      Chart components receive data with ISO timestamps and convert to pixel
      coordinates via TimelineScale; emit activeChartsDataState with ISO date
      strings in chunk boundaries
  - to: interactive-tooltip-system
    relation: implements
    description: >-
      getCoords in highlighter converts time ranges to pixel coordinates and
      formats dates for display using Luxon DateTime, starting from ISO strings
  - to: playback-control-system
    relation: implements
    description: >-
      Playback stepping functions work exclusively with ISO strings and
      millisecond milliseconds, never constructing Date objects for comparison
      or arithmetic
generator:
  version: 1
covers:
  - symbol: getCoords
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L29-L58'
  - symbol: findChunks
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L60-L82'
  - symbol: findValue
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L84-L93'
  - symbol: HighlighterData
    kind: type
    at: 'libs/timebar/src/charts/highlighter.tsx:L95-L101'
  - symbol: getHighlighterData
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L103-L192'
  - symbol: TimebarHighlighter
    kind: function
    at: 'libs/timebar/src/charts/highlighter.tsx:L194-L322'
  - symbol: BookmarkProps
    kind: type
    at: 'libs/timebar/src/components/bookmark.tsx:L16-L27'
  - symbol: Bookmark
    kind: function
    at: 'libs/timebar/src/components/bookmark.tsx:L29-L99'
  - symbol: GetStepProps
    kind: type
    at: 'libs/timebar/src/components/playback.utils.ts:L18-L28'
  - symbol: getStep
    kind: function
    at: 'libs/timebar/src/components/playback.utils.ts:L30-L38'
  - symbol: isUnparseableRange
    kind: function
    at: 'libs/timebar/src/components/playback.utils.ts:L40-L41'
  - symbol: toISOStringIfValid
    kind: function
    at: 'libs/timebar/src/components/playback.utils.ts:L43-L46'
  - symbol: getTimebarStepByDelta
    kind: function
    at: 'libs/timebar/src/components/playback.utils.ts:L48-L117'
  - symbol: Range
    kind: type
    at: 'libs/timebar/src/timebar-range.ts:L7-L7'
  - symbol: clampToMinAndMax
    kind: function
    at: 'libs/timebar/src/timebar-range.ts:L13-L37'
  - symbol: UseTimebarRangeParams
    kind: type
    at: 'libs/timebar/src/timebar-range.ts:L39-L45'
  - symbol: useTimebarRange
    kind: function
    at: 'libs/timebar/src/timebar-range.ts:L47-L91'
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

System-wide invariant: all time values circulate as ISO 8601 date strings (e.g., '2024-01-15T12:30:00Z') and millisecond timestamps (number), never JavaScript Date objects. The getTime utility converts ISO strings to milliseconds; getUTCDate and getUTCDateTime from data-transforms library handle safe date arithmetic. This convention prevents timezone confusion and serialization bugs across chart data, state management, and API boundaries.

## Related

- implements [[chart-rendering-engine]] — Chart components receive data with ISO timestamps and convert to pixel coordinates via TimelineScale; emit activeChartsDataState with ISO date strings in chunk boundaries
- implements [[interactive-tooltip-system]] — getCoords in highlighter converts time ranges to pixel coordinates and formats dates for display using Luxon DateTime, starting from ISO strings
- implements [[playback-control-system]] — Playback stepping functions work exclusively with ISO strings and millisecond milliseconds, never constructing Date objects for comparison or arithmetic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
