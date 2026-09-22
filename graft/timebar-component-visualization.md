---
name: Timebar Component & Visualization
slug: timebar-component-visualization
type: system
sources:
  - path: apps/platform/features/_map/timebar/RealTimeCountdown.tsx
    hash: ec78df88cbef5441e0a6f79794feba67151094463f4238a72e1834d20fe3b407
  - path: apps/platform/features/_map/timebar/timebar.config.ts
    hash: 4f883500be17de31548850facf986f1640e7b8b4daa36071301d6c116a4019fe
  - path: apps/platform/features/_map/timebar/Timebar.spec.tsx
    hash: b4c449f10e524dd1fff335372aaf43da043de1fa033eeabc1f879db6665e4705
  - path: apps/platform/features/_map/timebar/Timebar.tsx
    hash: 3a36ba657e61c79a8152d9700a0b7628aa35ef11a838a337773fdf283043fee0
sources_digest: 8903970c6cd790904de1d1346fdf8c308d39aeb5a842499445ee1e70c42e7470
links:
  - to: dataviews-datasets-state
    relation: depends_on
    description: >-
      Timebar queries active dataviews from Redux selectors to determine which
      data to visualize and filter by category (activity, vessel events,
      environmental)
  - to: deck-layer-integration
    relation: depends_on
    description: >-
      Timebar depends on VesselLayer, UserTracksLayer, and UserPointsTileLayer
      instances from @globalfishingwatch/deck-layer-composer for raw feature
      data
  - to: time-mode-real-time-state
    relation: depends_on
    description: >-
      Timebar reads selectTimeMode, selectRealTimeLatestAvailableTimerange, and
      real-time config to render playback controls and adjust interval
      strategies
  - to: timebar-data-connections
    relation: uses
    description: >-
      Timebar hooks (useTimebarVisualisation, useTimebarEnvironmentConnect,
      useTimebarVesselGroupConnect) sync visualization mode and data filters to
      Redux and URL query params
  - to: timebar-interaction-hooks
    relation: uses
    description: >-
      Timebar uses useTimebarMouseInteractions, useTimebarVesselTracks,
      useTimebarVesselEvents to handle mouse events, fetch layer data, and
      compute chart content
generator:
  version: 1
covers:
  - symbol: RealTimeCountdown
    kind: function
    at: 'apps/platform/features/_map/timebar/RealTimeCountdown.tsx:L18-L60'
  - symbol: TimebarWrapper
    kind: function
    at: 'apps/platform/features/_map/timebar/Timebar.tsx:L163-L397'
---

<!-- context:generated:start -->

## Summary

An interactive temporal slider and data visualization component that enables time-range selection, real-time data updates, vessel track/event display, and activity heatmap charts. It orchestrates data from multiple sources (deck layers, Redux state) and bridges UI interactions to global time state.

## Related

- depends on [[dataviews-datasets-state]] — Timebar queries active dataviews from Redux selectors to determine which data to visualize and filter by category (activity, vessel events, environmental)
- depends on [[deck-layer-integration]] — Timebar depends on VesselLayer, UserTracksLayer, and UserPointsTileLayer instances from @globalfishingwatch/deck-layer-composer for raw feature data
- depends on [[time-mode-real-time-state]] — Timebar reads selectTimeMode, selectRealTimeLatestAvailableTimerange, and real-time config to render playback controls and adjust interval strategies
- uses [[timebar-data-connections]] — Timebar hooks (useTimebarVisualisation, useTimebarEnvironmentConnect, useTimebarVesselGroupConnect) sync visualization mode and data filters to Redux and URL query params
- uses [[timebar-interaction-hooks]] — Timebar uses useTimebarMouseInteractions, useTimebarVesselTracks, useTimebarVesselEvents to handle mouse events, fetch layer data, and compute chart content

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
