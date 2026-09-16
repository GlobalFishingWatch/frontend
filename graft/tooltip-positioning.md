---
name: Tooltip positioning
slug: tooltip-positioning
type: system
sources:
  - path: libs/ui-components/src/tooltip/index.ts
    hash: 670ff4c3dc40a8d1429b01f5fcfb545bb61915a9754a84c22345fe78297adb6e
  - path: libs/ui-components/src/tooltip/Tooltip.tsx
    hash: edeb35f864b6b0e95d87bee9a80e1e2377246b6a588852b15a1d7e2664aa844a
sources_digest: 6ffb1fab0925123d2117f41868f4fe64af1d56edd754f1a8795e5e1dc8823555
links: []
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Floating tooltip component with automatic placement and viewport-aware positioning. Tooltip.tsx uses @floating-ui/react hooks (useFloating, useHover, useInteractions, useTransitionStyles) with flip and shift middleware to avoid viewport overflow; supports 500ms hover delay and 100ms animation duration. Handles two child types: string children wrapped in span with role="button", element children cloned with injected refs. Closes on child click via interaction handlers. Exports Tooltip and TooltipPlacement (Floating UI Placement type alias) through index barrel.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
