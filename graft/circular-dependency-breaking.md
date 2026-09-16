---
name: Circular Dependency Breaking
slug: circular-dependency-breaking
type: concept
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.merged.selectors.ts
    hash: 2d4f2dc61805197cd8d1c14a047a54245d8621a5e199bf1db3aa79fbed0b3f18
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts
    hash: 0b0d5d7f40a33fc39a3e2336769ca63bdcfd57ad480158ea362adc44e72a9128
sources_digest: 8a7b14abe8b68625d045c46cf42a5b58b63e000e78187d88cafcd52815096d50
links:
  - to: dataview-injection-context-aware-rendering
    relation: depends_on
    description: >-
      The split is necessary because dataviews.injected and dataviews.resolver
      both depend on merged.selectors and must not import each other.
generator:
  version: 1
covers:
  - symbol: selectActivityDataviewsBySubcategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts:L24-L33
---

<!-- context:generated:start -->

## Summary

Multiple selector modules are split into separate files to break circular import cycles. dataviews.merged.selectors lives apart from dataviews.resolver and dataviews.injected because both the latter depend on the former. Similarly, dataviews.static.selectors avoids importing from the main dataviews selectors module to break cycles with consumers. This pattern allows sibling modules to import freely without creating circular references while maintaining composability.

## Related

- depends on [[dataview-injection-context-aware-rendering]] — The split is necessary because dataviews.injected and dataviews.resolver both depend on merged.selectors and must not import each other.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
