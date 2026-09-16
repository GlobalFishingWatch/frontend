---
name: Advanced Search Query Builder
slug: advanced-search-query-builder
type: system
sources:
  - path: libs/api-client/src/utils/search.spec.ts
    hash: 37ea9253cea46370bb0cd1fb3dd8d36a13f09f3c9300df41f76b552dbe48d75d
  - path: libs/api-client/src/utils/search.ts
    hash: 4754ca6178ab96bb3a33cc0369a06df314a545995026b586b1eb5e9afc722161
sources_digest: cefce4caca9f5e06b2a9225fcd3392ba220aa8f7e6bd9a4e3a0bea65931f68f4
links: []
generator:
  version: 1
covers:
  - symbol: MultiSelectOption
    kind: type
    at: 'libs/api-client/src/utils/search.ts:L5-L10'
  - symbol: AdvancedSearchQueryFieldKey
    kind: type
    at: 'libs/api-client/src/utils/search.ts:L45-L45'
  - symbol: AdvancedSearchQueryField
    kind: type
    at: 'libs/api-client/src/utils/search.ts:L47-L52'
  - symbol: AdvancedSearchOperator
    kind: type
    at: 'libs/api-client/src/utils/search.ts:L54-L54'
  - symbol: AdvancedSearchQueryFieldParams
    kind: type
    at: 'libs/api-client/src/utils/search.ts:L55-L58'
  - symbol: withQuotationMarks
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L60-L64'
  - symbol: transform
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L62-L62'
  - symbol: toUpperCaseWithQuotationMarks
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L66-L70'
  - symbol: transform
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L68-L68'
  - symbol: toUpperCaseWithWildcardsAndQuotationMarks
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L72-L76'
  - symbol: transform
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L74-L74'
  - symbol: getAdvancedSearchQuery
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L180-L234'
  - symbol: getFieldQuery
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L184-L220'
  - symbol: getFieldValue
    kind: function
    at: 'libs/api-client/src/utils/search.ts:L192-L212'
---

<!-- context:generated:start -->

## Summary

Converts user-friendly search field definitions into advanced query syntax for vessel/maritime data searches. Handles 28+ field types (shipname LIKE with case normalization, ssvid exact match, flag equality with quoting, nested object routing for owner/shiptypes/geartypes). Supports multi-value OR combinations with parentheses wrapping, AND logic by default, and context-aware prefixes via rootObject parameter. Filters empty values and applies type-specific transformations.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
