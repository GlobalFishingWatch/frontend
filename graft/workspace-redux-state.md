---
name: Workspace Redux State
slug: workspace-redux-state
type: concept
sources:
  - path: apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts
    hash: 8a2709a07046ea8586dbb40af38cf448d53b86fe4fd6cb37f6e2160552096348
  - path: apps/platform/features/_map/timebar/TimebarClusterEventsGraph.hooks.ts
    hash: 6f8cee4a0498746a678018ee30228552139496ec8e0689dc2d120709566d8475
  - path: apps/platform/features/_map/timebar/TimebarSettings.tsx
    hash: 874856a6a63f5171ad1eb8f4c4f5b63e4cad16d55a5c2ea6bef5bd5ba15ef787
  - path: apps/platform/features/_map/workspace/activity/activity.hooks.tsx
    hash: 13810376a0efe677f03f6c1953277e5b8379b7ea4a0560ffdb2854c446d2e28f
  - path: apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx
    hash: 4a33fc119a1f71f53a52f5c317a14e7087bb2cf3cba6e76b600edcbd77157c4f
  - path: apps/platform/features/_map/workspace/activity/ActivitySection.tsx
    hash: 5e64eccfe5e109dd5401674b707cd3b2292b618cd0ceda8d672b40f78bdf3f8c
sources_digest: 6dc64bf0bc40620786da88ee01055dd5cb8632a0845c93fc49ea86a6f218adcb
links:
  - to: activity-dataview-management-system
    relation: produces
    description: >-
      Redux state provides selected/active dataviews and visualization modes via
      selectors
  - to: environmental-layer-management-system
    relation: produces
    description: >-
      Redux state provides environmental dataviews, user permissions, and
      real-time mode for histogram and filtering
generator:
  version: 1
covers:
  - symbol: useHeatmapActivityGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L44-L162'
  - symbol: setFourwingsPositionsData
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L102-L111
  - symbol: setFourwingsHeatmapData
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts:L113-L127
  - symbol: useClusterEventsGraph
    kind: function
    at: >-
      apps/platform/features/_map/timebar/TimebarClusterEventsGraph.hooks.ts:L27-L109
  - symbol: Icon
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L43-L67'
  - symbol: TimebarSettings
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L69-L384'
  - symbol: openOptions
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L92-L99'
  - symbol: closeOptions
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L100-L102'
  - symbol: setTimebarSectionActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L104-L111'
  - symbol: setEnvironmentActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L113-L121'
  - symbol: setUserPointsActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L122-L130'
  - symbol: setVesselGroupActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L132-L140'
  - symbol: setVesselActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L141-L149'
  - symbol: setVesselGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L151-L159'
  - symbol: getVesselGraphTooltip
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L161-L179'
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
---

<!-- context:generated:start -->

## Summary

Centralized Redux store managing map workspace state: viewport bounds, selected dataviews (activity, detections, environmental, context areas), visualization modes (heatmap resolution, animated vs static), time range, real-time mode toggle, user permissions (read-only, GFW user status), and Turning Tides-specific settings. Redux selectors provide scoped data access across features while Redux dispatch enables state mutations (visibility toggles, dataview upsertion, modal operations). Real-time mode alters time handling: replaces chunk-based caching with NONE and uses realTimeTimerange for buffered interval computation.

## Related

- produces [[activity-dataview-management-system]] — Redux state provides selected/active dataviews and visualization modes via selectors
- produces [[environmental-layer-management-system]] — Redux state provides environmental dataviews, user permissions, and real-time mode for histogram and filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
