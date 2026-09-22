---
name: Timeline Layout & Labels
slug: timeline-layout-labels
type: system
sources:
  - path: libs/timebar/src/timeline/timeline-layout.ts
    hash: e8b5ec0d2c65494526fe383a2351dd14d40fb66aa8873b8764acc98cd732d2d2
sources_digest: bdac5f2c68081d6fccd98593324920032939579f8a0e1e433b177ea72d9589f5
links:
  - to: interval-zoom-ui
    relation: implements
    description: >-
      TimelineUnits calls getUnitsPositions to render clickable unit labels with
      correct formatting based on zoom level
  - to: localization-labels
    relation: uses
    description: >-
      Applies TimebarLabels and locale-aware formatting from DEFAULT_LABELS;
      delegates label text selection to getUnitLabel
  - to: timeline-context-system
    relation: depends_on
    description: >-
      Uses outerScale (TimelineScale) to convert DateTime instances to pixel
      positions for label placement
generator:
  version: 1
covers:
  - symbol: getUnitLabel
    kind: function
    at: 'libs/timebar/src/timeline/timeline-layout.ts:L9-L115'
  - symbol: hourStr
    kind: function
    at: 'libs/timebar/src/timeline/timeline-layout.ts:L19-L24'
  - symbol: minuteStr
    kind: function
    at: 'libs/timebar/src/timeline/timeline-layout.ts:L25-L30'
  - symbol: getWeekFmt
    kind: function
    at: 'libs/timebar/src/timeline/timeline-layout.ts:L32-L37'
  - symbol: getUnitsPositions
    kind: function
    at: 'libs/timebar/src/timeline/timeline-layout.ts:L117-L173'
---

<!-- context:generated:start -->

## Summary

Responsive timeline axis label system that selects appropriate date formats based on available pixel width and zoom level. getUnitsPositions generates positioned unit objects (year/month/day/hour/minute labels); getUnitLabel delegates to a FORMATS lookup table with locale-aware hour/minute rendering and special boundary-unit handling.

## Related

- implements [[interval-zoom-ui]] — TimelineUnits calls getUnitsPositions to render clickable unit labels with correct formatting based on zoom level
- uses [[localization-labels]] — Applies TimebarLabels and locale-aware formatting from DEFAULT_LABELS; delegates label text selection to getUnitLabel
- depends on [[timeline-context-system]] — Uses outerScale (TimelineScale) to convert DateTime instances to pixel positions for label placement

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
