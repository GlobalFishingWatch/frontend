---
name: Router Integration & Navigation
slug: router-integration-navigation
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx
    hash: 51a6c8a36dd41ac7380c4081970ce55a26909dc6523441aae8bc8cafe2574f0c
  - path: apps/platform/features/_map/sidebar/buttons/NavigationWorkspaceButton.tsx
    hash: 9161df544a2f86f9ccd81af7f93c10efec6e66743d8cc0756d2f9cd1b79ac6cb
  - path: apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx
    hash: 671518c5e4ed97ab742b6250fd9cde8ff88569f1c008b3b43779923b76c3392f
  - path: apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx
    hash: b26fe69988878bb208f4536ef7077801b050b2bfe85cdf619f02ed00cbb82895
  - path: apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx
    hash: ddd12dcabf113e98e54d3744fc820177106dc34358d64dc4e6df1592e7341bc9
  - path: apps/platform/features/_map/sidebar/sidebar-header.hooks.ts
    hash: 50acfbbd729196da6dd4e4098d2deac83aa0b7a3ca4bb8f71caa6ac55c1bd90b
  - path: apps/platform/features/_map/sidebar/Sidebar.tsx
    hash: c1e47aeceb9f31a8c4c41c692bc7e9c8fcd057e82bfa69ca0945a8bdaca02fa8
  - path: apps/platform/features/_map/sidebar/SidebarHeader.tsx
    hash: 9a0b6371e591c1d1ce2af2278a382ddc89815c465e3915972801b84636711eb1
  - path: apps/platform/features/_map/timebar/timebar.hooks.ts
    hash: dedd5e051a654491d75bfd458869e16846c3872006188b89bab928d55840f24c
sources_digest: be2cfee17a9815b90dec20b53ba243c3b9da97c2d3613a6d6082ff160923acb3
links:
  - to: analytics-integration
    relation: uses
    description: >-
      Navigation buttons track route transitions via trackEvent with
      location-specific categories from TrackCategory mapping
  - to: map-sidebar-navigation-buttons
    relation: uses
    description: >-
      Navigation buttons use selectLocationType, selectIsVesselLocation, and
      TanStack Router Link to conditionally render and navigate to cleaned query
      parameters
  - to: sidebar-state-management
    relation: uses
    description: >-
      Router selectors like selectIsWorkspaceLocation and
      selectIsAnyVesselLocation determine whether time-mode and sidebar features
      render
  - to: timebar-data-connections
    relation: uses
    description: >-
      useReplaceQueryParams persists visualization mode, selected dataviews, and
      graph settings to URL for bookmarkable states
generator:
  version: 1
covers:
  - symbol: SidebarProps
    kind: type
    at: 'apps/platform/features/_map/sidebar/Sidebar.tsx:L24-L26'
  - symbol: Sidebar
    kind: function
    at: 'apps/platform/features/_map/sidebar/Sidebar.tsx:L28-L75'
  - symbol: SidebarHeader
    kind: function
    at: 'apps/platform/features/_map/sidebar/SidebarHeader.tsx:L93-L155'
  - symbol: handleScroll
    kind: function
    at: 'apps/platform/features/_map/sidebar/SidebarHeader.tsx:L110-L113'
  - symbol: NavigationHistoryButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx:L39-L148
  - symbol: onCloseClick
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx:L79-L111
  - symbol: NavigationWorkspaceButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/NavigationWorkspaceButton.tsx:L35-L108
  - symbol: SaveReportButton
    kind: function
    at: 'apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx:L23-L100'
  - symbol: onSaveClick
    kind: function
    at: 'apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx:L55-L59'
  - symbol: SaveWorkspaceButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx:L23-L131
  - symbol: onSaveClick
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx:L36-L42
  - symbol: onSaveAsClick
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx:L44-L48
  - symbol: onOpenChange
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx:L50-L56
  - symbol: ShareWorkspaceButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx:L13-L64
  - symbol: cleanVesselProfileDataviewInstances
    kind: function
    at: 'apps/platform/features/_map/sidebar/sidebar-header.hooks.ts:L4-L19'
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
---

<!-- context:generated:start -->

## Summary

TanStack Router integration that manages URL query parameters, route locations, and navigation flows throughout the map feature. It enables bookmarkable states (visualization modes, time ranges, viewport) and integrates cleanup logic for panel-specific state.

## Related

- uses [[analytics-integration]] — Navigation buttons track route transitions via trackEvent with location-specific categories from TrackCategory mapping
- uses [[map-sidebar-navigation-buttons]] — Navigation buttons use selectLocationType, selectIsVesselLocation, and TanStack Router Link to conditionally render and navigate to cleaned query parameters
- uses [[sidebar-state-management]] — Router selectors like selectIsWorkspaceLocation and selectIsAnyVesselLocation determine whether time-mode and sidebar features render
- uses [[timebar-data-connections]] — useReplaceQueryParams persists visualization mode, selected dataviews, and graph settings to URL for bookmarkable states

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
