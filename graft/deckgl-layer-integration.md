---
name: Deckgl Layer Integration
slug: deckgl-layer-integration
type: concept
sources:
  - path: apps/platform/features/_map/timebar/TimebarActivityGraph.hooks.ts
    hash: 8a2709a07046ea8586dbb40af38cf448d53b86fe4fd6cb37f6e2160552096348
  - path: apps/platform/features/_map/timebar/TimebarClusterEventsGraph.hooks.ts
    hash: 6f8cee4a0498746a678018ee30228552139496ec8e0689dc2d120709566d8475
  - path: apps/platform/features/_map/workspace/activity/activity.hooks.tsx
    hash: 13810376a0efe677f03f6c1953277e5b8379b7ea4a0560ffdb2854c446d2e28f
  - path: apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx
    hash: 4a33fc119a1f71f53a52f5c317a14e7087bb2cf3cba6e76b600edcbd77157c4f
  - path: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx
    hash: c5641be04de3f6fd6e00a96bec3720f7ac67606951e79e50d0b316802b2cdb50
  - path: apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx
    hash: 36e3a8cac6d38cce5d34fa8002690adc0c75750aac8fcffc53161dfb2d8c032a
sources_digest: 7f7e69cc4660f243eb07c3bc2a3ad37a900f6d4ddbb286e6ba55ac18d584bb67
links:
  - to: activity-dataview-management-system
    relation: produces
    description: >-
      useGetDeckLayer retrieves FourwingsLayer for activity dataviews to check
      positions availability and verify layer load state
  - to: environmental-layer-management-system
    relation: produces
    description: >-
      useGetDeckLayer accesses FourwingsLayer for histogram calculation and
      feature filtering
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
  - symbol: useVisualizationsOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/activity/activity.hooks.tsx:L39-L143'
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L42-L45
  - symbol: EnvironmentalLayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L47-L309
  - symbol: changeColor
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L108-L116
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L117-L119
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L121-L124
  - symbol: onToggleFilterOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx:L126-L134
  - symbol: EventsLayerPanelProps
    kind: type
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L39-L42'
  - symbol: EventsLayerPanel
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L44-L243'
  - symbol: closeExpandedContainer
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L79-L82'
  - symbol: onToggleFilterOpen
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L84-L86'
  - symbol: changeColor
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L88-L97'
  - symbol: onToggleColorOpen
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx:L99-L101'
---

<!-- context:generated:start -->

## Summary

Integration with @globalfishingwatch/deck-layer-composer providing hooks (useGetDeckLayer, useGetDeckLayers) to access instantiated FourwingsLayer and FourwingsClustersLayer deck.gl layer objects from render state. Layers expose loaded features, viewport-filtered chunks, sublayer visibility/values hashes, and aggregated statistics. The integration enables timebar hooks to extract raw feature data and transform it without duplicating deck.gl's rendering logic. Critical invariant: layers must be fully loaded (sourcesLoaded=true) before accessing viewport feature data; chunk boundaries trigger recalculation of timeseries data rather than per-frame viewport changes.

## Related

- produces [[activity-dataview-management-system]] — useGetDeckLayer retrieves FourwingsLayer for activity dataviews to check positions availability and verify layer load state
- produces [[environmental-layer-management-system]] — useGetDeckLayer accesses FourwingsLayer for histogram calculation and feature filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
