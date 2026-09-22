---
name: Stateful Tooltip Positioning with Floating-UI
slug: stateful-tooltip-positioning-with-floating-ui
type: concept
sources:
  - path: libs/responsive-visualizations/src/charts/points/IndividualPoint.tsx
    hash: 3e83cbf566e610524d66b32aecdb80212971f554829e1ba1aef43176ca4978b6
sources_digest: 9f2f5380657ef1613e71a02ed4c5fc51c8a960a5706c137dbf3b119f34775960
links:
  - to: individual-point-rendering
    relation: implements
    description: IndividualPoint applies this pattern for interactive tooltips
generator:
  version: 1
covers:
  - symbol: IndividualPointProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/points/IndividualPoint.tsx:L19-L28
  - symbol: IndividualPoint
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/points/IndividualPoint.tsx:L30-L99
---

<!-- context:generated:start -->

## Summary

IndividualPoint manages tooltip positioning via floating-ui's useFloating, useHover, and useInteractions hooks with middleware (offset, flip, shift) ensuring tooltips stay visible within viewport bounds. Tooltip visibility is stored in local isOpen state rather than parent-controlled, and tooltips render via FloatingPortal for correct DOM layering outside the hierarchical context.

## Related

- implements [[individual-point-rendering]] — IndividualPoint applies this pattern for interactive tooltips

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
