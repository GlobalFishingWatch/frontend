---
name: Events Layer Management
slug: events-layer-management
type: system
sources:
  - path: apps/platform/features/_map/workspace/events/EventsLayerPanel.tsx
    hash: 36e3a8cac6d38cce5d34fa8002690adc0c75750aac8fcffc53161dfb2d8c032a
  - path: apps/platform/features/_map/workspace/events/EventsSection.tsx
    hash: 10db7c2fedceec5d2a75426e37a0cec422af6ff7360d1f84cdf6d355dc92e588
sources_digest: 70580a68b5a4f5e010e69a289634b30c26d380dbe840e64c9c52ef2ba05df25d
links:
  - to: deckgl-layer-integration
    relation: uses
    description: >-
      useGetDeckLayer accesses FourwingsClustersLayer to determine layer load
      state and enable/disable controls
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Reads selectEventsDataviews and selectReadOnly for events state and
      permission enforcement
generator:
  version: 1
covers:
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
  - symbol: EventsLayerSection
    kind: function
    at: 'apps/platform/features/_map/workspace/events/EventsSection.tsx:L26-L90'
---

<!-- context:generated:start -->

## Summary

Manages event-type dataviews (e.g., cluster events, vessel encounters) in the map workspace. EventsSection orchestrates event layer visibility, add/remove controls, and analytics tracking. EventsLayerPanel manages individual event layer controls: visibility, color selection, schema-based filtering (supported fields: type, flag, vessel_type, speed), and removal. Integrates with useGetDeckLayer to check layer load state and useDeckLayerLoaded for tracking. Handles deprecated layer migrations via useMigrateToLatestDataview with automatic update capability for workspace owners. Private datasets trigger DatasetLoginRequired component.

## Related

- uses [[deckgl-layer-integration]] — useGetDeckLayer accesses FourwingsClustersLayer to determine layer load state and enable/disable controls
- depends on [[workspace-redux-state]] — Reads selectEventsDataviews and selectReadOnly for events state and permission enforcement

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
