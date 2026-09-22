---
name: Individual Point Rendering
slug: individual-point-rendering
type: file
sources:
  - path: libs/responsive-visualizations/src/charts/points/IndividualPoint.tsx
    hash: 3e83cbf566e610524d66b32aecdb80212971f554829e1ba1aef43176ca4978b6
sources_digest: 9f2f5380657ef1613e71a02ed4c5fc51c8a960a5706c137dbf3b119f34775960
links:
  - to: chart-configuration-defaults
    relation: depends_on
    description: Uses DEFAULT_POINT_SIZE as fallback for point sizing
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

IndividualPoint renders an interactive single data-point element as a colored circle or icon with hover-driven tooltips positioned via floating-ui. It manages local tooltip visibility state, uses FloatingPortal for correct DOM layering, and scales icon size relative to pointSize config.

## Related

- depends on [[chart-configuration-defaults]] — Uses DEFAULT_POINT_SIZE as fallback for point sizing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
