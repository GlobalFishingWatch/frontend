---
name: Time Snapping & Boundary Logic
slug: time-snapping-boundary-logic
type: concept
sources:
  - path: libs/timebar/src/components/playback.utils.ts
    hash: 4db3419fb0996619ee10cee6aa382edf846107ec15dad138ee6a4aaef0004de4
  - path: libs/timebar/src/components/timerange-selector.tsx
    hash: a73e381a1129fafdd4d5e841edfab8e86ce0b9c66c2d998bbc19a6a376932fe4
  - path: libs/timebar/src/timebar-range.ts
    hash: 1713134603063764cd064497a620b8688158a12d1b8cd07822844e6bc278cdf7
  - path: libs/timebar/src/timeline/timeline-drag.utils.ts
    hash: 53aaf65d025590a3acb29890ad8e39590d8aa40af9d3a5b183e41105179a754a
sources_digest: e94aed6720bcbe8b7a5cba9cb3b0b2a985f93442baf13cf3132fe7dfdcb8b4c3
links:
  - to: playback-control-system
    relation: implements
    description: >-
      getTimebarStepByDelta applies calendar-aware stepping (e.g., next month)
      or continuous speed-scaled steps, clamping to boundaries and detecting
      overflow
  - to: time-range-state-management
    relation: implements
    description: >-
      notifyChange in useTimebarRange uses clampToMinAndMax to enforce minimum
      and maximum range durations on all incoming changes
  - to: timeline-drag-handler
    relation: implements
    description: >-
      Drag operations use stickBoundary and resolveStickRange to snap handlers
      to calendar boundaries, with zoom-in snapping toward and zoom-out snapping
      away to prevent accidental collapse
generator:
  version: 1
covers:
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
  - symbol: TimeRangeSelectorProps
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L25-L39'
  - symbol: LastXOption
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L42-L47'
  - symbol: DateProperty
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L49-L49'
  - symbol: DateInputValues
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L51-L51'
  - symbol: DateInputValids
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L52-L52'
  - symbol: TimerangeLabels
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L54-L54'
  - symbol: DateInputGroupProps
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L56-L71'
  - symbol: DateInputGroup
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L74-L160'
  - symbol: getDisabledFields
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L162-L176'
  - symbol: TimeRangeSelector
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L178-L476'
  - symbol: updatePosition
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L194-L203'
  - symbol: submit
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L257-L290'
  - symbol: onLastXSelect
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L292-L309'
  - symbol: onDateChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L311-L343'
  - symbol: onDateBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L345-L355'
  - symbol: onStartChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L357-L358'
  - symbol: onEndChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L359-L360'
  - symbol: onStartBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L361-L362'
  - symbol: onEndBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L363-L364'
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
  - symbol: Dragging
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L18-L18'
  - symbol: ZoomState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L25-L29'
  - symbol: getIsHandlerZoomingIn
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L31-L46'
  - symbol: getIsHandlerZoomingOut
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L48-L53'
  - symbol: StickDir
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L55-L55'
  - symbol: stickBoundary
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L57-L61'
  - symbol: resolveStickRange
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L63-L82'
  - symbol: resolveDragSource
    kind: function
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L84-L88'
  - symbol: TimelineState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L90-L102'
  - symbol: TimelineLatestProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L118-L125'
  - symbol: TimeScaleRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L127-L127'
  - symbol: TimelineStateRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L128-L128'
  - symbol: TimelineLatestPropsRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L129-L129'
  - symbol: RangeRef
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L130-L130'
  - symbol: SetTimelineState
    kind: type
    at: 'libs/timebar/src/timeline/timeline-drag.utils.ts:L131-L131'
---

<!-- context:generated:start -->

## Summary

Cross-cutting design pattern for enforcing calendar-unit alignment and duration constraints on time ranges. Key functions include stickBoundary (snaps to hour/day/month boundaries using Luxon), resolveStickRange (computes snapped start/end applying directional floor/ceil logic), clampToAbsoluteBoundaries (enforces min/max range duration), and clampToMinAndMax (adjusts end date when duration is violated). Used by drag handler, playback stepping, and range picker to ensure consistent range semantics.

## Related

- implements [[playback-control-system]] — getTimebarStepByDelta applies calendar-aware stepping (e.g., next month) or continuous speed-scaled steps, clamping to boundaries and detecting overflow
- implements [[time-range-state-management]] — notifyChange in useTimebarRange uses clampToMinAndMax to enforce minimum and maximum range durations on all incoming changes
- implements [[timeline-drag-handler]] — Drag operations use stickBoundary and resolveStickRange to snap handlers to calendar boundaries, with zoom-in snapping toward and zoom-out snapping away to prevent accidental collapse

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
