---
name: Modal Workflows
slug: modal-workflows
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx
    hash: 671518c5e4ed97ab742b6250fd9cde8ff88569f1c008b3b43779923b76c3392f
  - path: apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx
    hash: b26fe69988878bb208f4536ef7077801b050b2bfe85cdf619f02ed00cbb82895
sources_digest: 08264ee5acde6e9b37959dd010a1055ab1ae2a13cec9bb9f8d581bf89b557314
links:
  - to: map-sidebar-navigation-buttons
    relation: uses
    description: >-
      SaveReportButton and SaveWorkspaceButton dispatch modal actions and
      lazy-load NewReportModal/workspace edit components via dynamic imports
  - to: router-integration-navigation
    relation: uses
    description: >-
      SaveReportButton navigates to report detail route on successful save and
      copies URL via useClipboardNotification
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

A state management pattern for controlling report creation and workspace editing modals. Components dispatch modal.slice actions to toggle editWorkspace and createWorkspace modals, which are lazy-loaded and wrapped in Suspense to reduce bundle size.

## Related

- uses [[map-sidebar-navigation-buttons]] — SaveReportButton and SaveWorkspaceButton dispatch modal actions and lazy-load NewReportModal/workspace edit components via dynamic imports
- uses [[router-integration-navigation]] — SaveReportButton navigates to report detail route on successful save and copies URL via useClipboardNotification

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
