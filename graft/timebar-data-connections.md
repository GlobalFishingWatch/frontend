---
name: Timebar Data Connections
slug: timebar-data-connections
type: system
sources:
  - path: apps/platform/features/_map/timebar/timebar.hooks.ts
    hash: dedd5e051a654491d75bfd458869e16846c3872006188b89bab928d55840f24c
  - path: apps/platform/features/_map/timebar/timebar.selectors.ts
    hash: d38b0b39534d1bb89876ace8d7d1d2559bda01b4be688235b8fae7f2a10c36cb
  - path: apps/platform/features/_map/timebar/timebar.slice.ts
    hash: 7d38bd36ab513fae1c6e28b664e18d3c5d7cd39696f2a6520e20ba3f86f9bf9c
sources_digest: 740d63d5751fb92b458611bd6b9182572fa1ebab4ce70294598bb243cacbb20e
links:
  - to: dataviews-datasets-state
    relation: depends_on
    description: >-
      Selectors read dataviews.categories.selectors and
      dataviews.instances.selectors to filter active dataviews by visualization
      type and compute available data
  - to: redux-caching-pattern
    relation: uses
    description: >-
      Hooks use Jotai's deckHoverInteractionAtom to access deck layer hover
      state without pulling it into the Redux store
  - to: router-integration-navigation
    relation: uses
    description: >-
      Hooks use useReplaceQueryParams to persist visualization mode, selected
      dataviews, and graph settings to URL for bookmarking and sharing
  - to: time-mode-real-time-state
    relation: uses
    description: >-
      Selectors compute selectRealTimeLatestAvailableTimerange and
      selectAvailableStart/End by combining real-time config with dataset
      extents
  - to: timebar-component-visualization
    relation: uses
    description: >-
      Hooks like useTimebarVisualisation, useTimebarEnvironmentConnect, and
      useTimebarVesselGroupConnect are called by Timebar to sync state changes
      to Redux and query params
generator:
  version: 1
covers:
  - symbol: useDisableHighlightTimeConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L44-L55'
  - symbol: useHighlightedEventsConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L57-L93'
  - symbol: useTimebarVisualisationConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L95-L116'
  - symbol: useTimebarEnvironmentConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L118-L133'
  - symbol: useTimebarUserPointsConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L135-L150'
  - symbol: useTimebarVesselGroupConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L152-L164'
  - symbol: useTimebarGraphConnect
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L166-L180'
  - symbol: useTimebarVisualisation
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.hooks.ts:L184-L265'
  - symbol: selectActiveActivityDataviewsByVisualisation
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.selectors.ts:L39-L89'
  - symbol: TimeRange
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L7-L10'
  - symbol: TimebarSlice
    kind: type
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L12-L18'
  - symbol: selectHighlightedTime
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L64-L64'
  - symbol: selectHighlightedEventSelected
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L65-L66'
  - symbol: selectHoveredHighlightedEvents
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L67-L67'
  - symbol: selectHasChangedSettingsOnce
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L68-L69'
  - symbol: selectRealTimeLatestUpdate
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar.slice.ts:L70-L70'
---

<!-- context:generated:start -->

## Summary

Custom React hooks that synchronize timebar UI state (visualization mode, selected dataviews, highlighted events) with Redux store and URL query parameters. They automate visualization selection based on active dataviews and manage state persistence.

## Related

- depends on [[dataviews-datasets-state]] — Selectors read dataviews.categories.selectors and dataviews.instances.selectors to filter active dataviews by visualization type and compute available data
- uses [[redux-caching-pattern]] — Hooks use Jotai's deckHoverInteractionAtom to access deck layer hover state without pulling it into the Redux store
- uses [[router-integration-navigation]] — Hooks use useReplaceQueryParams to persist visualization mode, selected dataviews, and graph settings to URL for bookmarking and sharing
- uses [[time-mode-real-time-state]] — Selectors compute selectRealTimeLatestAvailableTimerange and selectAvailableStart/End by combining real-time config with dataset extents
- uses [[timebar-component-visualization]] — Hooks like useTimebarVisualisation, useTimebarEnvironmentConnect, and useTimebarVesselGroupConnect are called by Timebar to sync state changes to Redux and query params

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
