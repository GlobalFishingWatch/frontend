---
name: Playback Control System
slug: playback-control-system
type: system
sources:
  - path: libs/timebar/src/components/playback.spec.tsx
    hash: b3350cc4ace569c7d607a1022e6ffad775b9aa2783fa9d356582d800a2ba6969
  - path: libs/timebar/src/components/playback.tsx
    hash: 9681001d8448a93292be9694d7670c1353055a6be0bb94d0c256987af555e04f
  - path: libs/timebar/src/components/playback.utils.spec.ts
    hash: b04618c6eda0e222a87f9a2c51e796889edc5ff66909877942a396fd40251241
  - path: libs/timebar/src/components/playback.utils.ts
    hash: 4db3419fb0996619ee10cee6aa382edf846107ec15dad138ee6a4aaef0004de4
sources_digest: e2e278e0269031937d49ffe984770dffd8685311999d7d1839bb4518420582ee
links:
  - to: event-tracking-constants
    relation: uses
    description: >-
      Emits EVENT_SOURCE.PLAYBACK_FRAME when advancing time and respects
      loop/speed configuration from SPEED_STEPS constants
  - to: time-range-state-management
    relation: depends_on
    description: >-
      Calls notifyChange with stepped ranges; relies on rangeRef for truthful
      state to avoid optimistic update bugs
  - to: time-snapping-boundary-logic
    relation: uses
    description: >-
      getTimebarStepByDelta applies calendar-aware stepping (e.g., one month) or
      speed-scaled continuous steps, with overflow safety and unparseable range
      detection
  - to: timebar-main-component
    relation: implements
    description: >-
      TimebarPlayback is a child component of Timebar; uses useTimebar hook to
      read/write state through TimebarContext
generator:
  version: 1
covers:
  - symbol: renderPlayback
    kind: function
    at: 'libs/timebar/src/components/playback.spec.tsx:L38-L49'
  - symbol: PlaybackProps
    kind: type
    at: 'libs/timebar/src/components/playback.tsx:L20-L24'
  - symbol: TimebarPlayback
    kind: function
    at: 'libs/timebar/src/components/playback.tsx:L26-L236'
  - symbol: tick
    kind: function
    at: 'libs/timebar/src/components/playback.tsx:L132-L148'
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
---

<!-- context:generated:start -->

## Summary

Playback UI and animation engine that steps time ranges forward/backward at user-selected speeds or calendar intervals. Uses requestAnimationFrame to smooth animation, maintains the single source of truth in rangeRef to survive tab backgrounding, and emits range updates through TimebarContext's notifyChange with EVENT_SOURCE.PLAYBACK_FRAME.

## Related

- uses [[event-tracking-constants]] — Emits EVENT_SOURCE.PLAYBACK_FRAME when advancing time and respects loop/speed configuration from SPEED_STEPS constants
- depends on [[time-range-state-management]] — Calls notifyChange with stepped ranges; relies on rangeRef for truthful state to avoid optimistic update bugs
- uses [[time-snapping-boundary-logic]] — getTimebarStepByDelta applies calendar-aware stepping (e.g., one month) or speed-scaled continuous steps, with overflow safety and unparseable range detection
- implements [[timebar-main-component]] — TimebarPlayback is a child component of Timebar; uses useTimebar hook to read/write state through TimebarContext

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
