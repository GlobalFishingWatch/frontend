---
name: Value Key Extraction & Normalization
slug: value-key-extraction-normalization
type: file
sources:
  - path: libs/responsive-visualizations/src/lib/values.ts
    hash: d673020150f2b48381e2d777d0a7f421fad2e4b9663be9a4470515c4bbda4282
sources_digest: 2c17cdad67a77f7b06b34b0e4f61eb58e3626232a8a6b54e4add63de7c10d377
links: []
generator:
  version: 1
covers:
  - symbol: getResponsiveVisualizationItemValue
    kind: function
    at: 'libs/responsive-visualizations/src/lib/values.ts:L5-L15'
---

<!-- context:generated:start -->

## Summary

Provides value extraction logic: DEFAULT_LABEL_KEY constant ('label'), getResponsiveVisualizationItemValue function that normalizes heterogeneous inputs (strings via parseFloat, numbers directly, objects via .value property) into numeric values for visualization.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
