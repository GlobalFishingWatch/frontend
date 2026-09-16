---
name: Numeric Safety and Type Coercion
slug: numeric-safety-and-type-coercion
type: concept
sources:
  - path: libs/data-transforms/src/numbers/numbers.ts
    hash: a54006268bd1ae02ecf1a2f1b14497b0f353ff62d8c684797d05d750eb39f905
sources_digest: facdb6cec0fefdde738b0b35b8fd354666b3f78d61e6660f1a00a5d2dd45ee9a
links: []
generator:
  version: 1
covers:
  - symbol: toFiniteNumber
    kind: function
    at: 'libs/data-transforms/src/numbers/numbers.ts:L8-L12'
---

<!-- context:generated:start -->

## Summary

Defensive numeric parsing strategy (toFiniteNumber in numbers module) that wraps Number() coercion to explicitly reject silent falsy conversions (null, undefined, empty strings collapsing to 0) while preserving legitimate zero values and filtering out non-finite results (NaN, Infinity). This guard prevents invalid measurements from masquerading as valid data in downstream tile rendering or quantitative calculations.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
