---
name: Lazy Expansion with DOM Preservation
slug: lazy-expansion-with-dom-preservation
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
sources_digest: 9b506ccf75433a3aa790566ae96838e12020ca7ac4c7062570f26b7422119480
links:
  - to: context-layer-tooltips
    relation: part_of
    description: Lazy expansion optimization is implemented in ContextTooltipRow
generator:
  version: 1
covers:
  - symbol: ContextTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L24-L41
  - symbol: ContextTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L43-L187
---

<!-- context:generated:start -->

## Summary

A UI pattern used by ContextTooltipRow that defers mounting expanded content (sparkline visualization) until user expansion, then unmounts it after CSS transition completion via setPanelMounted/reset lifecycle. This keeps the DOM lean during initial render while preserving CSS animation smoothness by toggling mounted state independently from expansion state, reducing render cost for long feature lists.

## Related

- part of [[context-layer-tooltips]] — Lazy expansion optimization is implemented in ContextTooltipRow

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
