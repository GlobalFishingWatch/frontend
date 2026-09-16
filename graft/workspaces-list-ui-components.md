---
name: Workspaces list UI components
slug: workspaces-list-ui-components
type: system
sources:
  - path: apps/platform/features/_map/workspaces-list/WorkspacesList.tsx
    hash: 65d67857a17bcfce36fba879935ac3802cc069254ada8f65d9f17ebf8010001b
  - path: apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx
    hash: 1e44835831d1c089c147ae90891d9d885b66c87349d1a50a6f75b03fee78b8ca
sources_digest: 17225a7f6460c8d01dc25b146c1d4c0740fe30445d835c019a4f123a75551541
links:
  - to: dataview-and-dataset-loading-integration
    relation: uses
    description: >-
      Dispatches fetchDataviewsByIdsThunk and fetchDatasetsByIdsThunk to preload
      visualization layers
  - to: router-state-and-navigation
    relation: uses
    description: >-
      Constructs navigation links based on workspace category; uses
      useSetMapCoordinates for viewport fitting
  - to: workspaces-list-configuration-and-types
    relation: uses
    description: Reads static workspace metadata for rendering and route construction
  - to: workspaces-list-management-redux-slice-selectors
    relation: uses
    description: >-
      Consumes highlighted workspace data and workspace list selectors;
      dispatches fetch thunks for dataviews/datasets
generator:
  version: 1
covers:
  - symbol: getItemLabel
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L54-L59'
  - symbol: WorkspaceWizard
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L61-L274'
  - symbol: updateMatchingAreas
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L73-L85'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L87-L96'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L98-L106'
  - symbol: onSearchClick
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L108-L115'
  - symbol: onHighlightedIndexChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L117-L123'
  - symbol: fetchMarineManagerData
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L126-L135'
  - symbol: onInputBlur
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L149-L154'
  - symbol: WorkspacesList
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspacesList.tsx:L26-L194'
---

<!-- context:generated:start -->

## Summary

React components rendering workspace discovery and selection interfaces—WorkspacesList displays highlighted workspaces as clickable cards with analytics tracking, WorkspaceWizard provides searchable ocean area discovery with map viewport fitting and dataview auto-loading. Handles navigation branching logic based on workspace category (DEFAULT_WORKSPACE_ID to MAP, Reports to WORKSPACE_REPORT, others to WORKSPACE with category/ID), coordinates dataview and dataset loading, and sanitizes user-provided descriptions.

## Related

- uses [[dataview-and-dataset-loading-integration]] — Dispatches fetchDataviewsByIdsThunk and fetchDatasetsByIdsThunk to preload visualization layers
- uses [[router-state-and-navigation]] — Constructs navigation links based on workspace category; uses useSetMapCoordinates for viewport fitting
- uses [[workspaces-list-configuration-and-types]] — Reads static workspace metadata for rendering and route construction
- uses [[workspaces-list-management-redux-slice-selectors]] — Consumes highlighted workspace data and workspace list selectors; dispatches fetch thunks for dataviews/datasets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
