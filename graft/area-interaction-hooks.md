---
name: Area Interaction Hooks
slug: area-interaction-hooks
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts
    hash: 85eb5ab12525fe0dd01d2a27503e08d532c717c54c46e9659f48a8e44a671747
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx
    hash: 00a19460456bfdaf3e5d29dc6fa40dd500036b6a2d1a9aa728193e84d947d3fb
sources_digest: f88f97bb09420a817554a4844fd330899b0bffec8744945836bf4b43b182fe6c
links:
  - to: context-layer-tooltips
    relation: part_of
    description: Area interaction hooks enable download and report workflows
generator:
  version: 1
covers:
  - symbol: getAreaIdFromFeature
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L20-L27
  - symbol: useContextInteractions
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L29-L101
  - symbol: ContextTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L24-L41
  - symbol: ContextTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L43-L187
  - symbol: ContextTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L19-L22
  - symbol: ContextTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L24-L96
---

<!-- context:generated:start -->

## Summary

Custom hooks that manage user interactions with context layer features. useContextInteractions returns memoized handlers (onDownloadClick, onReportClick) that dispatch Redux actions and analytics events, while useAreaRowExpansion manages expansion state for tooltip rows. Both hooks integrate with router state and map interaction utilities to coordinate viewport navigation and report initialization.

## Related

- part of [[context-layer-tooltips]] — Area interaction hooks enable download and report workflows

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
