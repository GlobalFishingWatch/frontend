---
name: Detections Dataview Management
slug: detections-dataview-management
type: file
sources:
  - path: apps/platform/features/_map/workspace/detections/DetectionsSection.tsx
    hash: 7e875cbaab0dc2a14e1060e15892f5e5078fbe84085b31d4ddd14c83b844ce80
sources_digest: 0d307d126f2a2d5aebf83d4503e954aa449f590565db677a92dba166e30ed593
links:
  - to: activity-dataview-management-system
    relation: uses
    description: >-
      Mirrors activity section pattern: visualization mode switching, bivariate
      pairing, layer removal
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Selects detection, activity, and bivariate dataview state to render
      controls and enforce visibility constraints
generator:
  version: 1
covers:
  - symbol: DetectionsSection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/detections/DetectionsSection.tsx:L43-L203
---

<!-- context:generated:start -->

## Summary

React component (DetectionsSection) that renders a collapsible workspace panel for detection layers in the map. Displays detection dataviews with visibility toggles and visualization mode switching via useVisualizationsOptions. Supports bivariate pairing mode (pairs two consecutive dataviews and disables conflicting animated heatmaps via visibility update). Integrates with Redux selectors (selectDetectionsDataviews, selectActivityDataviews, selectBivariateDataviews) and hooks (useDataviewInstancesConnect) for state management. Tracks analytics events via trackEvent with structured labels (activity sources, filters). Handles dataset login requirements and missing datasets via DatasetLoginRequired/DatasetNotFound components.

## Related

- uses [[activity-dataview-management-system]] — Mirrors activity section pattern: visualization mode switching, bivariate pairing, layer removal
- depends on [[workspace-redux-state]] — Selects detection, activity, and bivariate dataview state to render controls and enforce visibility constraints

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
