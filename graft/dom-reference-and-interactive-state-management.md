---
name: DOM reference and interactive state management
slug: dom-reference-and-interactive-state-management
type: concept
sources:
  - path: libs/ui-components/src/split-view/SplitView.tsx
    hash: 78e07ceb2d9c59b194dec43ccbf50effcb114a45444784e4ba623e9b2b268693
  - path: libs/ui-components/src/tooltip/Tooltip.tsx
    hash: edeb35f864b6b0e95d87bee9a80e1e2377246b6a588852b15a1d7e2664aa844a
  - path: libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx
    hash: 8d1def15f77ad7d7ff7ee6775286e9aacd9d3b6d832786ae3db0a44b4a5cba75
sources_digest: 1c140d38fcfb53f4e5518fcc4b9f34f4d83794754a6bda98d9249608fd4f529e
links: []
generator:
  version: 1
covers:
  - symbol: clampAsidePct
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L18-L18'
  - symbol: SplitViewProps
    kind: interface
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L20-L37'
  - symbol: SplitView
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L39-L183'
  - symbol: TooltipPlacement
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L19-L19'
  - symbol: TooltipProps
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L21-L26'
  - symbol: TooltipComponent
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L31-L97'
  - symbol: Tooltip
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L99-L109'
  - symbol: TransmissionsTimelineProps
    kind: type
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L10-L15
  - symbol: TransmissionsTimeline
    kind: function
    at: >-
      libs/ui-components/src/transmissions-timeline/TransmissionsTimeline.tsx:L17-L73
---

<!-- context:generated:start -->

## Summary

Components managing interactive state and DOM references via ref handling and state tracking: SplitView uses isDragging state across document-level mousemove/mouseup listeners for draggable resize handle; Tooltip uses FloatingPortal and Floating UI refs for position management; TransmissionsTimeline uses ResizeObserver to watch highlight bar element for responsive label visibility. Pattern indicates tight coupling between component state and DOM measurements/interactions, requiring careful ref lifecycle management.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
