---
name: Locale and internationalization
slug: locale-and-internationalization
type: concept
sources:
  - path: libs/ui-components/src/solar-status/SolarStatus.tsx
    hash: 57411b8a5fb757a8a2dde7957663ba17fcdc525e262d516baf848f133ec8c5ef
  - path: libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx
    hash: 8d1def15f77ad7d7ff7ee6775286e9aacd9d3b6d832786ae3db0a44b4a5cba75
  - path: >-
      libs/ui-components/src/transmissions-timeline/YearlyTransmissionsTimeline.tsx
    hash: d1f27ef076abba6150a71106b714ee962af329aeb910c91605738e69ab823bd7
sources_digest: 2f42f75ad1db7a6beab3d77e75a5590f068cdc9af97e9a819855263a974eb6e2
links: []
generator:
  version: 1
covers:
  - symbol: SolarStatusProps
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L12-L21'
  - symbol: SolarPhase
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L23-L26'
  - symbol: SolarStatus
    kind: function
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L61-L118'
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

Type and enum system from @globalfishingwatch/api-types providing multilingual support across SolarStatus, TransmissionsTimeline, and YearlyTransmissionsTimeline components. Locale enum includes at least Locale.en, es, fr, id, pt; components use locale prop to enable date formatting and label translation without conditional branching. Centralized dependency simplifying i18n integration.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
