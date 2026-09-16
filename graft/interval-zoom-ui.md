---
name: Interval & Zoom UI
slug: interval-zoom-ui
type: system
sources:
  - path: libs/timebar/src/components/interval-selector.tsx
    hash: c4d63caeae36c6eb1436bd9dedf675c944505f285fb5a6fca9dbb875534fc035
  - path: libs/timebar/src/timeline/timeline-units.tsx
    hash: 444aa3b09b00465ba35b96f38c80131d830cf1fb4d782c07d374ed64b2e6f9ea
sources_digest: 9761253e7673e5d50179a21ae8b7ffdd103e2809ff704695ef3384b70ba463fa
links:
  - to: event-tracking-constants
    relation: uses
    description: >-
      Interval selection emits EVENT_SOURCE.INTERVAL_CHANGE and
      EVENT_INTERVAL_SOURCE mappings for each interval type
  - to: time-snapping-boundary-logic
    relation: uses
    description: >-
      Interval selector uses CONFIG_BY_INTERVAL and LIMITS_BY_INTERVAL from
      deck-loaders; units use clampToAbsoluteBoundaries and getDeltaDays for
      range calculations
  - to: timebar-main-component
    relation: implements
    description: >-
      Both are child components of Timebar; consume useTimebar hook to read
      current range and emit changes
  - to: timeline-layout-labels
    relation: implements
    description: >-
      TimelineUnits calls getUnitsPositions to generate clickable unit buttons;
      TimebarIntervalSelector references interval metadata
generator:
  version: 1
covers:
  - symbol: TimebarIntervalSelector
    kind: function
    at: 'libs/timebar/src/components/interval-selector.tsx:L15-L95'
  - symbol: TimelineUnitsProps
    kind: type
    at: 'libs/timebar/src/timeline/timeline-units.tsx:L13-L25'
  - symbol: TimelineUnits
    kind: function
    at: 'libs/timebar/src/timeline/timeline-units.tsx:L27-L119'
---

<!-- context:generated:start -->

## Summary

User-facing UI for selecting predefined time intervals (day, month, year, etc.) and zooming into date ranges. TimebarIntervalSelector renders clickable interval buttons; TimelineUnits renders time-unit labels along the axis that users can click to zoom; both coordinate with Timebar state to update the visible range.

## Related

- uses [[event-tracking-constants]] — Interval selection emits EVENT_SOURCE.INTERVAL_CHANGE and EVENT_INTERVAL_SOURCE mappings for each interval type
- uses [[time-snapping-boundary-logic]] — Interval selector uses CONFIG_BY_INTERVAL and LIMITS_BY_INTERVAL from deck-loaders; units use clampToAbsoluteBoundaries and getDeltaDays for range calculations
- implements [[timebar-main-component]] — Both are child components of Timebar; consume useTimebar hook to read current range and emit changes
- implements [[timeline-layout-labels]] — TimelineUnits calls getUnitsPositions to generate clickable unit buttons; TimebarIntervalSelector references interval metadata

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
