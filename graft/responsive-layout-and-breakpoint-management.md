---
name: Responsive layout and breakpoint management
slug: responsive-layout-and-breakpoint-management
type: concept
sources:
  - path: libs/ui-components/src/split-view/SplitView.tsx
    hash: 78e07ceb2d9c59b194dec43ccbf50effcb114a45444784e4ba623e9b2b268693
sources_digest: 1797eab62cbfe8f818ca5ddacb14abe523c7e6b49cd9776cd7aa6c8a0354853f
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

Pattern used in SplitView and potentially other responsive components to handle mobile-to-desktop layout transitions via useSmallScreen hook from @globalfishingwatch/react-hooks. SplitView switches UI paradigm (toggle button on desktop → Choice component on mobile) based on screen size. Abstracted as a cross-cutting concept because it represents a shared responsive design constraint across potentially multiple components.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
