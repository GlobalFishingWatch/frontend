---
name: Visualization Mode Selection
slug: visualization-mode-selection
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/VisualisationChoice.tsx
    hash: c101ec7c2d219dbfa9659fb1b5d8e00392c48bea5296587bee490ba2fdb3c544
sources_digest: fe9840f063d97f69d228c8ab7ea79022fb8c809c9f90879816eb111418ac6614
links: []
generator:
  version: 1
covers:
  - symbol: VisualisationChoiceProps
    kind: interface
    at: >-
      apps/platform/features/_map/workspace/shared/VisualisationChoice.tsx:L9-L15
  - symbol: VisualisationChoice
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/VisualisationChoice.tsx:L17-L72
  - symbol: onOptionClickHandle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/VisualisationChoice.tsx:L24-L28
---

<!-- context:generated:start -->

## Summary

VisualisationChoice component that renders mutually-exclusive radio-button-style options (positions, heatmap, etc.) for selecting map visualization modes. Implements collapsible UI where positions/heatmap options are always visible when active, but other options collapse when unselected, creating adaptive compact/expanded layouts. Respects disabled states on individual options and includes ARIA accessibility attributes.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
