---
name: Split-view layout
slug: split-view-layout
type: system
sources:
  - path: libs/ui-components/src/split-view/index.ts
    hash: ed5baa14ee8dc436dda8ceae508cd24ef15b2ccced410f00199b333bc06540d4
  - path: libs/ui-components/src/split-view/SplitView.tsx
    hash: 78e07ceb2d9c59b194dec43ccbf50effcb114a45444784e4ba623e9b2b268693
sources_digest: 427d796956d740f2a17eb79a439d3faa61ea145c06cf9f6f32f18576fb5b01ce
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
---

<!-- context:generated:start -->

## Summary

Responsive two-panel layout with collapsible sidebar and resizable divider. Manages state via `isOpen`, `isDragging`, and `widthPct` for resize persistence; constrains aside width to 33–66% of viewport; switches from desktop toggle button to mobile Choice component; implements document-level mousemove/mouseup listeners for dragging. A notable gotcha is manual setState-in-render synchronization of internalOpen with isOpen prop.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
