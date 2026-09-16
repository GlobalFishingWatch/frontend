---
name: Vessel Insights Display System
slug: vessel-insights-display-system
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/insights/InsightCoverage.tsx
    hash: 4188b5cb9662d742992eadc1767dff317b125d0a45b6fd2eec0436436ff698a0
  - path: apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx
    hash: 08fde6b31d989b7cc4ae0f10bbdfb58ce61f517d87c01aaef5657d8333ca0891
  - path: apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx
    hash: 71c7374ad53edea61feec62e926e2da7cd6096e9e52a65d883a407cb456bbfa7
  - path: apps/platform/features/_vessels/vessel/insights/InsightGaps.tsx
    hash: 54ada34cc0d74671aa55032e5df628a112e5fba49de65813fb52e4a3f923c58a
  - path: apps/platform/features/_vessels/vessel/insights/InsightGapsDetails.tsx
    hash: 9d3f12a553507acbef8fb5e52b8219b12c937bee137a6929e1e305b95031b88b
  - path: apps/platform/features/_vessels/vessel/insights/InsightIUU.tsx
    hash: 8d44c866b346f85fc79738e10fb4644a993b58a4591013fabf967d7dad548e24
  - path: apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx
    hash: a38ccc18c14cc3b52a8a85cee95a8d90303000f8423a742b963691c3cbdbc3b9
  - path: apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx
    hash: d1ad08f6a3d490be40a329f76a7d27ac112f19884d776da0d92daefc84279ae0
  - path: apps/platform/features/_vessels/vessel/insights/insights.config.ts
    hash: 5754c3abf6a675ffc8fe52f43dff8d1d4702f53aa58f3806163738b8ff217147
  - path: apps/platform/features/_vessels/vessel/insights/Insights.tsx
    hash: c73a3e3cb0f88250f82f6b179e46af1f10b39255fe704fcabbf170618485dcce
  - path: apps/platform/features/_vessels/vessel/insights/insights.utils.ts
    hash: a17223f7fed918b9185d63eb2ef4c087f0d765da97bcc958bc332c896a81d1e9
  - path: apps/platform/features/_vessels/vessel/insights/InsightWrapper.tsx
    hash: dfe0621ec58c28fb528951f4f774bb42b10d639ae98e18e7751de04ccfb0c6be
sources_digest: 9026f695fe5bdf0cd46e9537130aeeb780773ee30f4f52414709a681c942abc1
links:
  - to: authentication-gating-in-insights
    relation: implements
    description: >-
      InsightFlagChanges and InsightMOUList gate content behind
      selectIsGuestUser checks
  - to: fishing-event-filtering
    relation: uses
    description: >-
      InsightFishing and InsightLongline filter RFMO events to tuna zones only
      via removeNonTunaRFMO
  - to: insight-data-loading-error-handling
    relation: produces
    description: >-
      InsightWrapper fetches data via useGetVesselInsightQuery and maps to
      specialized display components
  - to: time-range-validation-in-insights
    relation: implements
    description: >-
      Insights component blocks rendering if selected time range predates
      MIN_INSIGHTS_YEAR (2020)
generator:
  version: 1
covers:
  - symbol: InsightCoverage
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightCoverage.tsx:L13-L52
  - symbol: InsightFishing
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx:L18-L114
  - symbol: InsightFlagChanges
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx:L17-L70
  - symbol: InsightGaps
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightGaps.tsx:L15-L66'
  - symbol: InsightGapsDetails
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightGapsDetails.tsx:L20-L69
  - symbol: InsightIUU
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightIUU.tsx:L11-L47'
  - symbol: InsightLongline
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L37-L149
  - symbol: onShowOnMapClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L86-L91
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L93-L104
  - symbol: InsightMOUList
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L17-L194
  - symbol: getMOUListAppearance
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L68-L172
  - symbol: InsightWrapper
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightWrapper.tsx:L23-L79'
  - symbol: Insights
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/Insights.tsx:L22-L65'
  - symbol: NonAPIInsights
    kind: type
    at: 'apps/platform/features/_vessels/vessel/insights/insights.config.ts:L6-L6'
  - symbol: VesselInsight
    kind: type
    at: 'apps/platform/features/_vessels/vessel/insights/insights.config.ts:L8-L8'
  - symbol: removeNonTunaRFMO
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/insights.utils.ts:L7-L16'
---

<!-- context:generated:start -->

## Summary

Renders a dashboard of activity and coverage insights for a selected vessel, including fishing events, signal gaps, IUU listings, flag changes, MOU port control appearances, and longline fishing details. Manages time-range validation, loading/error states, user authentication gating, and CSV export functionality with specialized visualization components for each insight type.

## Related

- implements [[authentication-gating-in-insights]] — InsightFlagChanges and InsightMOUList gate content behind selectIsGuestUser checks
- uses [[fishing-event-filtering]] — InsightFishing and InsightLongline filter RFMO events to tuna zones only via removeNonTunaRFMO
- produces [[insight-data-loading-error-handling]] — InsightWrapper fetches data via useGetVesselInsightQuery and maps to specialized display components
- implements [[time-range-validation-in-insights]] — Insights component blocks rendering if selected time range predates MIN_INSIGHTS_YEAR (2020)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
