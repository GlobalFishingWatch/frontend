---
name: Transmissions timeline visualizations
slug: transmissions-timeline-visualizations
type: system
sources:
  - path: libs/ui-components/src/transmissions-timeline/index.ts
    hash: 197fd9b2ba7c9f27889486637c5cc09f9ca68c9809e4b99bcf9320dab9aea475
  - path: libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx
    hash: 8d1def15f77ad7d7ff7ee6775286e9aacd9d3b6d832786ae3db0a44b4a5cba75
  - path: >-
      libs/ui-components/src/transmissions-timeline/YearlyTransmissionsTimeline.tsx
    hash: d1f27ef076abba6150a71106b714ee962af329aeb910c91605738e69ab823bd7
sources_digest: 4702d511b0425f82e329d6e22e246a0a8efcbf1929e063f0676adcb48a1a8457
links: []
generator:
  version: 1
covers:
  - symbol: TransmissionsTimelineProps
    kind: type
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L10-L15
  - symbol: TransmissionsTimeline
    kind: function
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L17-L73
  - symbol: TransmissionsTimelineProps
    kind: type
    at: >-
      libs/ui-components/src/transmissions-timeline/YearlyTransmissionsTimeline.tsx:L10-L17
  - symbol: YearlyTransmissionsTimeline
    kind: function
    at: >-
      libs/ui-components/src/transmissions-timeline/YearlyTransmissionsTimeline.tsx:L19-L59
---

<!-- context:generated:start -->

## Summary

Visualizes transmission temporal coverage via two complementary views. TransmissionsTimeline.tsx renders a proportional bar showing transmission timespan relative to baseline (2012-present), calculates percentage widths via Luxon date math, and uses ResizeObserver to responsively adjust label visibility (month/day details only above 30px, month info above 90px). YearlyTransmissionsTimeline.tsx renders yearly blocks from configurable start year through current year, highlighting years with transmissions and supporting year-hover interaction. Both use Luxon for UTC-aware date handling and accept locale prop for Locale-aware formatting. Module exports both components through index barrel.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
