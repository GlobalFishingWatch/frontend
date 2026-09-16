---
name: Statistics Utilities
slug: statistics-utilities
type: file
sources:
  - path: apps/platform/utils/statistics.ts
    hash: d331835c062e3964a1d57fa359e44911f4c4a0b90674257acbff342181e48090
sources_digest: 7da7d9486ef48794d318d7da9bb61256ac3b5ae37f807cd4dfb2447ac478a997
links: []
generator:
  version: 1
covers:
  - symbol: weightedMean
    kind: function
    at: 'apps/platform/utils/statistics.ts:L1-L17'
---

<!-- context:generated:start -->

## Summary

Pure calculation utility exporting a single weightedMean function that computes weighted averages from parallel numeric arrays. No edge case validation; assumes equal-length inputs and non-zero cumulative weights.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
