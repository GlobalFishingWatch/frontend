---
name: Timebar Interaction Hooks
slug: timebar-interaction-hooks
type: file
sources:
  - path: apps/platform/features/_map/timebar/timebar-interactions.hooks.ts
    hash: c486bc5b4f00c8076abdb7bdbc872c18f201aa7ac8d3037ae23134c91486ee58
sources_digest: 7e50ab8c776d3c3ad886415e4f951b3497a2130a8abdf13deaf0ea30b799b607
links:
  - to: analytics-integration
    relation: uses
    description: >-
      Hooks call trackEvent with GA_ACTIONS.CHANGE_TIME_RANGE to log all timebar
      interactions
  - to: time-mode-real-time-state
    relation: uses
    description: >-
      Hooks dispatch to timebar.slice (setHighlightedTime, setHighlightedEvents)
      and call useTimerangeConnect to update global time state
  - to: timebar-component-visualization
    relation: uses
    description: >-
      useTimebarMouseInteractions and useTimebarBookmark are imported and called
      by Timebar component to handle all user interaction events
generator:
  version: 1
covers:
  - symbol: useTimebarBookmark
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L39-L60'
  - symbol: useOnTimebarRangeChange
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L62-L99'
  - symbol: useTimebarMouseInteractions
    kind: function
    at: >-
      apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L101-L208
---

<!-- context:generated:start -->

## Summary

Custom React hooks that manage user interactions with the timebar (mouse movement, clicking, bookmarking) and convert them into Redux state updates, time-range changes, and analytics events. The hooks handle viewport adjustments, event click navigation, and UI feedback.

## Related

- uses [[analytics-integration]] — Hooks call trackEvent with GA_ACTIONS.CHANGE_TIME_RANGE to log all timebar interactions
- uses [[time-mode-real-time-state]] — Hooks dispatch to timebar.slice (setHighlightedTime, setHighlightedEvents) and call useTimerangeConnect to update global time state
- uses [[timebar-component-visualization]] — useTimebarMouseInteractions and useTimebarBookmark are imported and called by Timebar component to handle all user interaction events

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
