---
name: Solar status display
slug: solar-status-display
type: system
sources:
  - path: libs/ui-components/src/solar-status/index.ts
    hash: e5179b5269bfad938361900611964b5a10e3f7617b5557ac4cd66d2adec75f8c
  - path: libs/ui-components/src/solar-status/SolarStatus.tsx
    hash: 57411b8a5fb757a8a2dde7957663ba17fcdc525e262d516baf848f133ec8c5ef
sources_digest: 1337f4a501b8aa842edf7a90b4a988f0f634929e769ffc63717cc1a2afde20bb
links: []
generator:
  version: 1
covers:
  - symbol: SolarStatusProps
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L12-L21'
  - symbol: SolarPhase
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L23-L26'
  - symbol: SolarStatus
    kind: function
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L61-L118'
---

<!-- context:generated:start -->

## Summary

Displays the current solar phase (day/night/dawn/dusk) at a location and time using the suncalc library's astronomical calculations. SolarStatus.tsx computes solar events based on lat/lon/timestamp, handles edge cases like polar nights via phase-priority logic (day → dawn → dusk → night), and renders a labeled icon with tooltip. The module exports both the component and types through an index barrel.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
