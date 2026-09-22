---
name: Deck.gl Bundle Splitting Strategy
slug: deck-gl-bundle-splitting-strategy
type: concept
sources:
  - path: apps/platform/features/_map/workspace/selectors/app.selectors.ts
    hash: ba4032fe83030126b077b99ad859f62d6347a1c024a3ed3cebc0e4cb6bd15f2c
sources_digest: 5c2b9a5e5fa45df525b1ad90d5849d766bb9196747b7f4f829018a04dfcdebef
links:
  - to: workspace-and-dataview-state-selectors
    relation: part_of
    description: >-
      app.selectors is part of the selector layer but isolates heavy library
      imports to support bundle-splitting goals
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Isolates deck-layers library imports into a dedicated selector module (app.selectors) to prevent bundling the deck.gl library into every entry chunk. The module conditionally imports HEATMAP_HIGH_RES_ID and RulerData types only when needed, and applies visualization mode overrides for report contexts (positions mode becomes heatmap in area reports). This design prioritizes code-splitting over API surface area.

## Related

- part of [[workspace-and-dataview-state-selectors]] — app.selectors is part of the selector layer but isolates heavy library imports to support bundle-splitting goals

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
