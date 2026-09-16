---
name: Map Sidebar Navigation & Buttons
slug: map-sidebar-navigation-buttons
type: system
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
sources_digest: c7d57ad66be861e069e9ae7b6483aa96c831926aaa7a4dd086dc6818665d3936
links:
  - to: analytics-integration
    relation: uses
    description: >-
      Navigation buttons track user actions via trackEvent with route-specific
      categories for analysis
  - to: clipboard-notifications
    relation: uses
    description: >-
      ShareWorkspaceButton and SaveReportButton use useClipboardNotification
      hook to copy URLs and display transient success feedback
  - to: modal-workflows
    relation: uses
    description: >-
      SaveReportButton and SaveWorkspaceButton dispatch modal.slice actions to
      show report creation / workspace edit/save-as dialogs
  - to: router-integration-navigation
    relation: depends_on
    description: >-
      Buttons use TanStack Router Link for navigation,
      selectLocationType/selectIsVesselLocation to determine context, and
      cleanVesselProfileDataviewInstances to sanitize query params
  - to: sidebar-state-management
    relation: uses
    description: >-
      Buttons read from Redux selectors (selectWorkspace,
      selectIsWorkspaceOwner, selectLocationType) and dispatch cleanup actions
      to multiple slices (vessel.slice, reports.slice)
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
---

<!-- context:generated:start -->

## Summary

A collection of sidebar action buttons and navigation controls that manage workspace state transitions, clipboard operations, and user authentication flows. These components integrate heavily with Redux for state queries and route-aware conditional rendering.

## Related

- uses [[analytics-integration]] — Navigation buttons track user actions via trackEvent with route-specific categories for analysis
- uses [[clipboard-notifications]] — ShareWorkspaceButton and SaveReportButton use useClipboardNotification hook to copy URLs and display transient success feedback
- uses [[modal-workflows]] — SaveReportButton and SaveWorkspaceButton dispatch modal.slice actions to show report creation / workspace edit/save-as dialogs
- depends on [[router-integration-navigation]] — Buttons use TanStack Router Link for navigation, selectLocationType/selectIsVesselLocation to determine context, and cleanVesselProfileDataviewInstances to sanitize query params
- uses [[sidebar-state-management]] — Buttons read from Redux selectors (selectWorkspace, selectIsWorkspaceOwner, selectLocationType) and dispatch cleanup actions to multiple slices (vessel.slice, reports.slice)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
