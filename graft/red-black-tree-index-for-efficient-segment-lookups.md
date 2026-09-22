---
name: Red-Black Tree Index for Efficient Segment Lookups
slug: red-black-tree-index-for-efficient-segment-lookups
type: concept
sources:
  - path: apps/track-labeler/src/features/tracks/tracks.selectors.ts
    hash: 5eaaa04c11b7ef03c2455e90752dd88032cdcdebc24d53f018372f842d6ffd36
sources_digest: 8325910ffd62ae9f5ace3c241ed362513f097dee14d245801c1c9d7b913cb32a
links: []
generator:
  version: 1
covers:
  - symbol: PointEvent
    kind: type
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L95-L95'
  - symbol: getCurrentVesselAction
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L185-L205'
  - symbol: getNodeAction
    kind: function
    at: 'apps/track-labeler/src/features/tracks/tracks.selectors.ts:L191-L199'
---

<!-- context:generated:start -->

## Summary

Track selectors build a functional red-black tree (from functional-red-black-tree npm package) indexed by timestamp from selected track segments to enable O(log n) lookups when determining which action label applies to each raw track point. This optimization is critical for parsing large vessel tracks efficiently; without it, every point would require O(n) segment search. The tree is built once per selector recomputation and cached via reselect memoization.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
