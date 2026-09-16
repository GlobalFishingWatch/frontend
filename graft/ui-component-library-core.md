---
name: UI Component Library Core
slug: ui-component-library-core
type: system
sources:
  - path: libs/ui-components/src/index.ts
    hash: 67fe855c8460cfd278ab517dcb932aa33141544027000cf697603f507be40382
sources_digest: c350012f11617f78d704ac9275b98aeced40e082c09498211d4a16c17af0c530
links:
  - to: data-visualization-components
    relation: produces
    description: >-
      Core index exports data display components (carousel, progress-bar,
      transmissions-timeline, solar-status)
  - to: input-components
    relation: produces
    description: >-
      Core index exports form inputs (button, input-text, checkbox, select,
      slider) for consumer applications
  - to: layout-container-components
    relation: produces
    description: >-
      Core index exports layout primitives (card, modal, tabs, split-view) for
      UI scaffolding
  - to: map-legend-system
    relation: produces
    description: Core index exports map legend variants for cartographic data display
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Central barrel export layer (libs/ui-components/src/index.ts) that re-exports 40+ reusable React components for form controls, layout, data visualization, and domain-specific UI elements. Serves as the primary public API for consumers; enables imports from a single path but can impact tree-shaking if only a subset is needed.

## Related

- produces [[data-visualization-components]] — Core index exports data display components (carousel, progress-bar, transmissions-timeline, solar-status)
- produces [[input-components]] — Core index exports form inputs (button, input-text, checkbox, select, slider) for consumer applications
- produces [[layout-container-components]] — Core index exports layout primitives (card, modal, tabs, split-view) for UI scaffolding
- produces [[map-legend-system]] — Core index exports map legend variants for cartographic data display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
