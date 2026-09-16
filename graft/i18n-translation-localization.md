---
name: I18n Translation & Localization
slug: i18n-translation-localization
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/track-correction/track-correction.config.ts
    hash: a08508e5ab4d940f2946099a9e7a91aa761335c1366850f6368c1c1f28a879dd
  - path: apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx
    hash: c71f24d5f7ab9d2847401368b68006a470f56e1b4a3c66227bc450c2128db05d
  - path: apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx
    hash: 740d8440ef34e95fa8781b6173315b34574246285be2944b39a2972dcff8fb58
  - path: apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx
    hash: 68adcd8af46128ec62e954a0497df854c11266c23aa895649e8c7ee3a226ae3c
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx
    hash: c325b832fc64b895930c2f70d748694251aee63d16413393338f1e2c024ba006
sources_digest: c98bdaad24b5521d0cd6c92e61d1f14c92aed2f119096b9e0b347b3de154c174
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      getTrackCorrectionIssueOptions returns localized issue type labels via
      curried t function
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      useActivityEventTranslations provides event descriptions, duration labels,
      and region names with i18n support
generator:
  version: 1
covers:
  - symbol: getTrackCorrectionIssueOptions
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.config.ts:L12-L19
  - symbol: VesselActivitySummary
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx:L39-L257
  - symbol: ActivityDateProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx:L11-L13
  - symbol: ActivityDate
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx:L15-L38
  - symbol: EventProps
    kind: interface
    at: 'apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx:L9-L11'
  - symbol: ActivityEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx:L13-L19
  - symbol: useFetchRegionsData
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx:L25-L33
  - symbol: useActivityEventTranslations
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx:L35-L255
---

<!-- context:generated:start -->

## Summary

Curried `t` function with nested key paths (e.g., `trackCorrection.*` for track corrections). Event descriptions pulled from useActivityEventTranslations hook with region/source context. Luxon DateTime for timezone-aware formatting. react-i18next provides component hooks (useTranslation).

## Related

- implements [[track-correction-feature]] — getTrackCorrectionIssueOptions returns localized issue type labels via curried t function
- implements [[vessel-activity-event-system]] — useActivityEventTranslations provides event descriptions, duration labels, and region names with i18n support

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
