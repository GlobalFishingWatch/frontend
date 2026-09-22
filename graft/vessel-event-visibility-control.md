---
name: Vessel Event Visibility Control
slug: vessel-event-visibility-control
type: system
sources:
  - path: apps/platform/features/_map/workspace/vessels/vessel-events.hooks.ts
    hash: 6562f575114a27f203c45aa645096610d7f89365f5588fef7a2c67cce6dc64e7
  - path: apps/platform/features/_map/workspace/vessels/VesselEventsLegend.tsx
    hash: 6363d3c77ca1221deb547b85a8d996329b3043dee679d75b2b81d562f2bd90a3
  - path: apps/platform/features/_map/workspace/vessels/VesselEventToggle.tsx
    hash: e7e609fc5c9ed3fa6636afc520fac4067b1c6935cff19b5e0dbff73c7bc8d242
sources_digest: 879918e9ea32ee2ec40c33e77fb091f215eb6414baccb0f80a12d79d22c52e91
links:
  - to: vessel-tracking-and-metadata
    relation: uses
    description: >-
      VesselEventsLegend displays toggles for event types, with color
      integration tied to active vessel track count
generator:
  version: 1
covers:
  - symbol: VesselEventToggleProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselEventToggle.tsx:L13-L18
  - symbol: VesselEventToggle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselEventToggle.tsx:L20-L46
  - symbol: VesselEventsLegendProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselEventsLegend.tsx:L21-L23
  - symbol: VesselEventsLegend
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselEventsLegend.tsx:L25-L103
  - symbol: isVesselEventVisible
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/vessel-events.hooks.ts:L20-L27
  - symbol: useVisibleVesselEvents
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/vessel-events.hooks.ts:L29-L60
---

<!-- context:generated:start -->

## Summary

Hooks and components (isVesselEventVisible, useVisibleVesselEvents, VesselEventToggle, VesselEventsLegend) that manage visibility state of vessel event types (fishing, loitering, encounters, ports, gaps). Persists visibility preferences via Redux and URL query parameters with intelligent normalization to 'all' or 'none' when all events are selected or none are selected. Supports per-event-type toggling with color-coded icons from EVENTS_COLORS configuration.

## Related

- uses [[vessel-tracking-and-metadata]] — VesselEventsLegend displays toggles for event types, with color integration tied to active vessel track count

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
