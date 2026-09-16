---
name: Data Visualization Components
slug: data-visualization-components
type: system
sources:
  - path: libs/ui-components/src/progress-bar/index.ts
    hash: 9d57ab18166268540578f7d3dca2821494776196f0ce37d131aab13addaca7fa
  - path: libs/ui-components/src/progress-bar/ProgressBar.tsx
    hash: 229f7e7a48ecf2481759ca13669f0ee9fbd951016798e256d5c17e01232fff05
sources_digest: 8798d1ae2f64f93bf6a9e87dc235a9662606fa73b1aff264a6009c127da1193c
links:
  - to: icon-system
    relation: uses
    description: ProgressBar uses IconButton for help documentation modal trigger
  - to: layout-container-components
    relation: uses
    description: ProgressBar uses Modal to display optional helpText
generator:
  version: 1
covers:
  - symbol: ProgressBarProps
    kind: interface
    at: 'libs/ui-components/src/progress-bar/ProgressBar.tsx:L9-L18'
  - symbol: ProgressBar
    kind: function
    at: 'libs/ui-components/src/progress-bar/ProgressBar.tsx:L19-L97'
---

<!-- context:generated:start -->

## Summary

ProgressBar component for displaying numeric progress with optional labels and help documentation, supporting loading states and disabled styling.

## Related

- uses [[icon-system]] — ProgressBar uses IconButton for help documentation modal trigger
- uses [[layout-container-components]] — ProgressBar uses Modal to display optional helpText

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
