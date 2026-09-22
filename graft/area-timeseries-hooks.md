---
name: Area Timeseries Hooks
slug: area-timeseries-hooks
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextLayerSparkline.tsx
    hash: e7141b04f22bc33eeabb991d7a16e10317141c3e0a483d41f35ee75e30c6058f
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
sources_digest: d99e76a64540b1ad51a78dd4d842a3b9cd57a26d259eafa306b5b6975a88765c
links:
  - to: context-layer-tooltips
    relation: part_of
    description: Area timeseries hooks support sparkline visualization in context tooltips
generator:
  version: 1
covers:
  - symbol: ContextLayerSparkline
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerSparkline.tsx:L15-L60
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

Custom hooks that encapsulate timeseries data fetching for context layer features. useAreaTooltipTimeseries manages loading state, temporal boundaries, and data fetching based on feature and selected option, while useAreaTooltipSparklineCategory manages category selection state and available options. These hooks delegate fetch orchestration to avoid polluting component logic with data loading concerns.

## Related

- part of [[context-layer-tooltips]] — Area timeseries hooks support sparkline visualization in context tooltips

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
