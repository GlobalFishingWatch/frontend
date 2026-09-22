---
name: Analytics Integration
slug: analytics-integration
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx
    hash: 51a6c8a36dd41ac7380c4081970ce55a26909dc6523441aae8bc8cafe2574f0c
  - path: apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx
    hash: ddd12dcabf113e98e54d3744fc820177106dc34358d64dc4e6df1592e7341bc9
  - path: apps/platform/features/_map/timebar/timebar-interactions.hooks.ts
    hash: c486bc5b4f00c8076abdb7bdbc872c18f201aa7ac8d3037ae23134c91486ee58
sources_digest: 8584195ebf562ebdca8a75afa49c6d344172865abd24de8f0be9b5b21f715da0
links:
  - to: map-sidebar-navigation-buttons
    relation: uses
    description: >-
      Navigation buttons call trackEvent with TrackCategory.VesselProfile and
      location-specific actions to log user panel closures
  - to: router-integration-navigation
    relation: uses
    description: >-
      ShareWorkspaceButton uses shareTitle and trackEventCategory mappings keyed
      by ROUTE_TYPES to localize analytics labels
  - to: timebar-interaction-hooks
    relation: uses
    description: >-
      useOnTimebarRangeChange calls trackEvent with GA_ACTIONS.CHANGE_TIME_RANGE
      to log all timebar interactions
generator:
  version: 1
covers:
  - symbol: NavigationHistoryButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx:L39-L148
  - symbol: onCloseClick
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx:L79-L111
  - symbol: ShareWorkspaceButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx:L13-L64
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

Instrumentation for tracking user interactions (button clicks, time-range changes, navigation) via Google Analytics through trackEvent function and GA_ACTIONS/TrackCategory mappings. Location-aware category and action labels enable granular analytics segmentation.

## Related

- uses [[map-sidebar-navigation-buttons]] — Navigation buttons call trackEvent with TrackCategory.VesselProfile and location-specific actions to log user panel closures
- uses [[router-integration-navigation]] — ShareWorkspaceButton uses shareTitle and trackEventCategory mappings keyed by ROUTE_TYPES to localize analytics labels
- uses [[timebar-interaction-hooks]] — useOnTimebarRangeChange calls trackEvent with GA_ACTIONS.CHANGE_TIME_RANGE to log all timebar interactions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
