---
name: Time Mode & Real-Time State
slug: time-mode-real-time-state
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/TimeModeSelector.tsx
    hash: aa6c6b371507e16cec3fee5ddc873bed289098d62db619045b65063b2aacf886
  - path: apps/platform/features/_map/timebar/RealTimeCountdown.tsx
    hash: ec78df88cbef5441e0a6f79794feba67151094463f4238a72e1834d20fe3b407
  - path: apps/platform/features/_map/timebar/timebar-realtime.hooks.ts
    hash: 7e0b868ae8e0f10076c5dded8f04a6105a0afa1e3f37e2ec49d4c8b07e865536
  - path: apps/platform/features/_map/timebar/timebar.selectors.ts
    hash: d38b0b39534d1bb89876ace8d7d1d2559bda01b4be688235b8fae7f2a10c36cb
sources_digest: 1948b0346e717455bc3ec7ae8c00cc39d64eba13528d4e15aba5294e8489d3da
links:
  - to: router-integration-navigation
    relation: depends_on
    description: >-
      TimeModeSelector uses useReplaceQueryParams to persist selected mode to
      URL and useTimerangeConnect to sync global time range
  - to: sidebar-container-layout
    relation: uses
    description: >-
      SidebarHeader conditionally renders TimeModeSelector in workspace/vessel
      locations when IS_REALTIME_ENABLED config flag is true
  - to: timebar-component-visualization
    relation: uses
    description: >-
      Timebar reads selectTimeMode and selectRealTimeLatestAvailableTimerange to
      render appropriate playback controls and interval strategies
  - to: timebar-data-fetching-hooks
    relation: uses
    description: >-
      Data fetching hooks check selectIsRealTimeMode to apply
      FOURWINGS_REAL_TIME_INTERVALS and adjust time window calculations
generator:
  version: 1
covers:
  - symbol: TimeModeSelector
    kind: function
    at: 'apps/platform/features/_map/sidebar/TimeModeSelector.tsx:L18-L59'
  - symbol: onSelect
    kind: function
    at: 'apps/platform/features/_map/sidebar/TimeModeSelector.tsx:L37-L52'
  - symbol: RealTimeCountdown
    kind: function
    at: 'apps/platform/features/_map/timebar/RealTimeCountdown.tsx:L18-L60'
  - symbol: useRealTimeDataUpdates
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L9-L40'
  - symbol: clearTimers
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L15-L24'
  - symbol: tick
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-realtime.hooks.ts:L26-L28'
  - symbol: selectActiveActivityDataviewsByVisualisation
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.selectors.ts:L39-L89'
---

<!-- context:generated:start -->

## Summary

A global state concept managing the map's temporal viewing mode (historical vs. real-time), real-time data refresh intervals, and time-range bounds. The system automates mode switching based on user selections and synchronizes UI components with latest available data timestamps.

## Related

- depends on [[router-integration-navigation]] — TimeModeSelector uses useReplaceQueryParams to persist selected mode to URL and useTimerangeConnect to sync global time range
- uses [[sidebar-container-layout]] — SidebarHeader conditionally renders TimeModeSelector in workspace/vessel locations when IS_REALTIME_ENABLED config flag is true
- uses [[timebar-component-visualization]] — Timebar reads selectTimeMode and selectRealTimeLatestAvailableTimerange to render appropriate playback controls and interval strategies
- uses [[timebar-data-fetching-hooks]] — Data fetching hooks check selectIsRealTimeMode to apply FOURWINGS_REAL_TIME_INTERVALS and adjust time window calculations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
