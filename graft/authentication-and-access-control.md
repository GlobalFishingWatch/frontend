---
name: Authentication and Access Control
slug: authentication-and-access-control
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx
    hash: a663c804f82a80aea802661719b42db62df2447a6fba7580730ce6f5f631aaed
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverage.tsx
    hash: 55d31bfb70ee0063dbb0e6d98504cc42e078a00f37df15975c3f90317e50b737
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx
    hash: 66951e413a98a8a7ef06ab3a1ca44eb11ec7e5c8ecdf05fcb6f202fb9372f0e9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx
    hash: 4a9be44b103a1e16b45b3914c4c6d532bc0c8ddfe7704bf5e39d5e9f5bf1ca0b
  - path: apps/platform/features/_user/GFWOnly.tsx
    hash: 514c793b35522a3b324895b1f8377d58dd98432ea033785db1092594faec0c4f
sources_digest: 5b23fe5b712c8a14c304414eae37b34e0cae3d86c131942a5a67315a835f676e
links:
  - to: events-report-system
    relation: configures
    description: >-
      EventsReportDownload wraps download button in UserLoggedIconButton to
      enforce authentication before CSV export
  - to: vessel-group-report-insights-system
    relation: configures
    description: >-
      Insight components check selectIsGuestUser and render login walls or
      permission error icons conditionally
generator:
  version: 1
covers:
  - symbol: EventsReportDownloadProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx:L14-L16
  - symbol: EventsReportDownload
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx:L17-L79
  - symbol: VesselGroupReportInsightCoverage
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverage.tsx:L18-L53
  - symbol: VesselGroupReportInsightFlagChange
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L28-L122
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L41-L52
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L54-L60
  - symbol: ExpandedMOUInsights
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L34-L34
  - symbol: VesselGroupReportInsightMOU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L36-L198
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L47-L53
  - symbol: VesselsInMOUByCategory
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L64-L113
  - symbol: getVesselsInMOU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L115-L156
  - symbol: onToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L116-L131
  - symbol: GFWOnlyProps
    kind: type
    at: 'apps/platform/features/_user/GFWOnly.tsx:L12-L18'
  - symbol: GFWOnly
    kind: function
    at: 'apps/platform/features/_user/GFWOnly.tsx:L26-L69'
---

<!-- context:generated:start -->

## Summary

Multi-layer access control distinguishes GFW/JAC staff (selectIsGFWUser, selectIsJACUser) from regular and guest users. Guest users see login prompts (VesselIdentityFieldLogin) instead of sensitive details like flag changes or MOU lists. Downloads require UserLoggedIconButton wrapping to enforce authentication. Permission errors (HTTP 403) render specialized icon tooltips rather than generic messages, improving UX for restricted content.

## Related

- configures [[events-report-system]] — EventsReportDownload wraps download button in UserLoggedIconButton to enforce authentication before CSV export
- configures [[vessel-group-report-insights-system]] — Insight components check selectIsGuestUser and render login walls or permission error icons conditionally

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
