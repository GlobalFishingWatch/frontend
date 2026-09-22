---
name: Vessel Search and Interaction
slug: vessel-search-and-interaction
type: system
sources:
  - path: apps/platform/test/integration/Vessels.spec.tsx
    hash: 22477e72ab30ec4668ffb57f4cf5049638ecab1491dd2a63d215353cdf0e21f9
  - path: apps/platform/test/integration/VesselSearch.spec.tsx
    hash: 5fae4a3612e45b5cdb325c665d1ad49d051e1d489fe89c803d68a116d246cdf3
sources_digest: 7679fa6def8721b0425259417938e2c980737258d9a5d686862afe09cd662dbd
links:
  - to: map-layer-and-viewport-state-management
    relation: depends_on
    description: >-
      Vessel tracks render via deck layers and use coordinate projection for
      interactions
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), and map interaction utilities'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Integrates vessel search by name, track display on interactive maps with coordinate projection, and search state persistence across navigation. Tests verify Redux store updates, map track rendering via deckLayersStateAtom, and search input state management with clearing behavior.

## Related

- depends on [[map-layer-and-viewport-state-management]] — Vessel tracks render via deck layers and use coordinate projection for interactions
- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), and map interaction utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
