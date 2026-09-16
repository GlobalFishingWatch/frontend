---
name: Activity Dataview Management System
slug: activity-dataview-management-system
type: system
sources:
  - path: apps/platform/features/_map/workspace/activity/activity.hooks.tsx
    hash: 13810376a0efe677f03f6c1953277e5b8379b7ea4a0560ffdb2854c446d2e28f
  - path: apps/platform/features/_map/workspace/activity/activity.utils.ts
    hash: 3124a29e5d99f4003bc82fdd647317e8f5cc0bbc432ebc00ea4a65ac38c5a05d
  - path: apps/platform/features/_map/workspace/activity/ActivityAuxiliaryLayer.tsx
    hash: b80d400336f38d7b77a42ea64dde873577b809f63379f51598fb7513eda8fac0
  - path: apps/platform/features/_map/workspace/activity/ActivityFitBounds.tsx
    hash: aef08ec69f17bea857a70b39c58c9d5bcfc39f3e0f29439b90f31099be575920
  - path: apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx
    hash: 4a33fc119a1f71f53a52f5c317a14e7087bb2cf3cba6e76b600edcbd77157c4f
  - path: apps/platform/features/_map/workspace/activity/ActivitySection.tsx
    hash: 5e64eccfe5e109dd5401674b707cd3b2292b618cd0ceda8d672b40f78bdf3f8c
sources_digest: 4059da105ae98fdd50a24d24f33425d0f561b436ab2516b291fda1e70c48418e
links:
  - to: activity-dataview-filtering
    relation: uses
    description: >-
      ActivityLayerPanel integrates ActivityFilters and TurningTides-specific
      filter UIs (TurningTidesFilters, TurningTidesTags) for advanced data
      filtering
  - to: deckgl-layer-integration
    relation: uses
    description: >-
      Checks layer load state and positions availability via useGetDeckLayer;
      verifies sublayer support before rendering position mode
  - to: timebar-activity-hook
    relation: produces
    description: >-
      Activity visibility and visualization mode state determines which timebar
      activity graph is rendered and how data is aggregated
  - to: workspace-redux-state
    relation: uses
    description: >-
      Reads/writes activity dataview state, visualization modes, and bivariate
      settings via Redux selectors and dispatch
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityAuxiliaryLayer.tsx:L16-L18
  - symbol: ActivityAuxiliaryLayer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityAuxiliaryLayer.tsx:L20-L66
  - symbol: onAuxiliarLayerSwitchToggle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityAuxiliaryLayer.tsx:L32-L39
  - symbol: ActivityFitBoundsProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityFitBounds.tsx:L10-L13
  - symbol: ActivityFitBounds
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityFitBounds.tsx:L15-L34
  - symbol: onFitBoundsHandle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityFitBounds.tsx:L20-L22
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L57-L62
  - symbol: ActivityLayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L64-L421
  - symbol: disableBivariate
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L115-L117
  - symbol: onSplitLayers
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L119-L134
  - symbol: onLayerSwitchToggle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L136-L141
  - symbol: onRemoveLayerClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L143-L148
  - symbol: onToggleFilterOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L150-L155
  - symbol: changeColor
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L157-L166
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L168-L170
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx:L172-L175
  - symbol: ActivitySection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/ActivitySection.tsx:L42-L208
  - symbol: useVisualizationsOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.hooks.tsx:L39-L143'
  - symbol: isDefaultActivityDataview
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.utils.ts:L11-L13'
  - symbol: isDefaultDetectionsDataview
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.utils.ts:L15-L16'
  - symbol: getSourcesOptionsInDataview
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.utils.ts:L20-L27'
  - symbol: getSourcesSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.utils.ts:L29-L40'
  - symbol: areAllSourcesSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.utils.ts:L42-L51'
---

<!-- context:generated:start -->

## Summary

Manages activity and detection dataviews in the map workspace: displays layer panels for visibility/color/filter control, allows switching between visualization modes (low/default/high-res heatmaps, vessel positions), enables bivariate mode pairing, and provides utilities to classify dataviews (default activity vs detections) and extract dataset sources. Core components: ActivitySection orchestrates activity/detection layer panels and visualization mode switching; ActivityLayerPanel manages individual layer controls; useVisualizationsOptions builds dynamic mode choices based on active dataview constraints and availability; activity.utils provides predicates (isDefaultActivityDataview, isDefaultDetectionsDataview) and source extraction (getSourcesSelectedInDataview). One invariant: high-res visualization disables when vessel group filters are active; positions mode only shows if all active dataviews support it and underlying layer reports availability.

## Related

- uses [[activity-dataview-filtering]] — ActivityLayerPanel integrates ActivityFilters and TurningTides-specific filter UIs (TurningTidesFilters, TurningTidesTags) for advanced data filtering
- uses [[deckgl-layer-integration]] — Checks layer load state and positions availability via useGetDeckLayer; verifies sublayer support before rendering position mode
- produces [[timebar-activity-hook]] — Activity visibility and visualization mode state determines which timebar activity graph is rendered and how data is aggregated
- uses [[workspace-redux-state]] — Reads/writes activity dataview state, visualization modes, and bivariate settings via Redux selectors and dispatch

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
