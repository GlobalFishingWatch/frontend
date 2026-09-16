---
name: Analytics Tracking
slug: analytics-tracking
type: system
sources:
  - path: apps/platform/features/_reports/tabs/events/EventsReportDownload.tsx
    hash: a663c804f82a80aea802661719b42db62df2447a6fba7580730ce6f5f631aaed
  - path: apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx
    hash: 66a78bd90d4fb856784e4106c2023a526e07f0539619325a4ff6931a2ce3e7b8
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx
    hash: 823d3e9c9c32f6dd5426a7111b98849139f6c8f345b0a664beb57a75a1fa1ad9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx
    hash: 66951e413a98a8a7ef06ab3a1ca44eb11ec7e5c8ecdf05fcb6f202fb9372f0e9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx
    hash: 93b3d457c299ee4c02b64aca641c30c24fa5cdc6c70d81e1edf29b76df8b6572
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx
    hash: e06e5e59bfe062c3f4b2608cf11f0aa253975cc57d8ed39a15e389bb90459954
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx
    hash: 448b6932910e79a3730f28cf48a1ce5470c2ed176e33e5485ad6f3eed7e5f971
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx
    hash: 4a9be44b103a1e16b45b3914c4c6d532bc0c8ddfe7704bf5e39d5e9f5bf1ca0b
  - path: apps/platform/features/app/analytics.hooks.ts
    hash: b17b759776db61adc16748f4d283d22023bc214eefee5ad4f3c04348f4f11fd6
  - path: apps/platform/features/nav/HelpHub.tsx
    hash: eaaf8702185c55681d00df7e8c4e548772333ecf640f5b1c3a83fa229c2d2221
  - path: apps/platform/features/onboarding/onboarding.hooks.ts
    hash: 6eb2fd98738e5970161215a9e39a8fe04ced6e02fd60a2037595ef0a0a8a2688
sources_digest: 78a25d427c4212ccea80c7689fb919bbc82958d76957f2d5f39c8d17fa0c640d
links:
  - to: events-report-system
    relation: validates
    description: >-
      Analytics events measure user engagement with event visualizations and
      downloads
  - to: i18n-localization
    relation: uses
    description: Tracks language preference in analytics context
  - to: router-integration
    relation: depends_on
    description: >-
      Derives route type via mapRoutePathToType and detects navigation changes
      to dispatch page-view events
  - to: user-authentication-session
    relation: uses
    description: >-
      Enriches tracked events with user id, organization, cohort, groups from
      Redux user selectors and login state
  - to: vessel-group-report-insights-system
    relation: validates
    description: >-
      Analytics events track which insights users expand and which vessels they
      investigate, informing product roadmap
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
  - symbol: EventsReportGraphSelectorProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L23-L26
  - symbol: EventsReportGraphSelector
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L28-L95
  - symbol: onSelect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/EventsReportGraphSelector.tsx:L71-L80
  - symbol: VesselGroupReportInsightFishing
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L37-L226
  - symbol: onMPAToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L53-L67
  - symbol: onRFMOToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L69-L83
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L85-L91
  - symbol: getVesselGroupReportInsighFishingVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L93-L155
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
  - symbol: VesselGroupReportInsightGap
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L30-L155
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L41-L52
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L54-L60
  - symbol: VesselGroupReportInsightIUU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx:L23-L81
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx:L34-L45
  - symbol: VesselWithEvents
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L32-L37
  - symbol: getVesselsWithEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L39-L51
  - symbol: VesselGroupReportInsightLongline
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L53-L191
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L78-L87
  - symbol: onCategoryToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L89-L98
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L100-L106
  - symbol: renderCategoryVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L108-L153
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
  - symbol: TrackCategory
    kind: enum
    at: 'apps/platform/features/app/analytics.hooks.ts:L15-L34'
  - symbol: useAnalytics
    kind: function
    at: 'apps/platform/features/app/analytics.hooks.ts:L38-L99'
  - symbol: HelpHub
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L21-L154'
  - symbol: onHelpClick
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L33-L40'
  - symbol: getFAQsLink
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L42-L45'
  - symbol: getVideoTutorialsLink
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L47-L50'
  - symbol: redirectEvent
    kind: function
    at: 'apps/platform/features/nav/HelpHub.tsx:L52-L58'
  - symbol: getGuideTarget
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L26-L29'
  - symbol: useOnboardingCardActions
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L35-L98'
  - symbol: useOnboardingCopilotPrompt
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L104-L125'
  - symbol: pickNext
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L133-L136'
  - symbol: prefersReducedMotion
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L138-L143'
  - symbol: useTypewriterPlaceholder
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L150-L184'
  - symbol: tick
    kind: function
    at: 'apps/platform/features/onboarding/onboarding.hooks.ts:L161-L176'
---

<!-- context:generated:start -->

## Summary

Consistent analytics instrumentation across reports: trackEvent with category Analysis logs event downloads (EventsReportDownload), graph type selections (EventsReportGraphSelector); TrackCategory.VesselGroupReport tracks insight expansions and vessel navigation (all VGRInsight* components). Events include context like download action, selection name, and time range for product usage measurement.

## Related

- validates [[events-report-system]] — Analytics events measure user engagement with event visualizations and downloads
- uses [[i18n-localization]] — Tracks language preference in analytics context
- depends on [[router-integration]] — Derives route type via mapRoutePathToType and detects navigation changes to dispatch page-view events
- uses [[user-authentication-session]] — Enriches tracked events with user id, organization, cohort, groups from Redux user selectors and login state
- validates [[vessel-group-report-insights-system]] — Analytics events track which insights users expand and which vessels they investigate, informing product roadmap

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
