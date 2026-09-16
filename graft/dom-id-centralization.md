---
name: DOM ID Centralization
slug: dom-id-centralization
type: concept
sources:
  - path: libs/ui-components/src/dom-ids.ts
    hash: 9eb746ba6fe2849bbe8ce2872587eadbacac8973516a69ea4d6f0bca34723ec9
sources_digest: 4bbed87c4268da33666c2cbd6a04f9107952acf4d83c5bdba2c19bb485d2df5f
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Single source of truth for application structure DOM element IDs (SPLIT_VIEW_DOM_ID, MAIN_DOM_ID, SIDEBAR_DOM_ID) exported from dom-ids.ts. Prevents magic strings scattered throughout codebase and enables safe refactoring of layout markup—any component that needs to interact with structural layout imports from this module rather than duplicating identifiers.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
