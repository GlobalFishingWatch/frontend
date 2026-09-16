---
name: String & Data Formatting Utilities
slug: string-data-formatting-utilities
type: system
sources:
  - path: apps/platform/utils/shared.ts
    hash: 8e5074e8b33fcd7c1853ee79c18d0ef76b9dc1f0028c973400ace6c9d0a7070f
sources_digest: 8e1e95f8a795415c3f1850b3a0e8d5e8ff3f46cd8a6af8bd65c4ef1322a792ad
links:
  - to: i18n-system
    relation: depends_on
    description: >-
      listAsSentence uses i18n t() function for localized 'and'/'or'
      conjunctions
generator:
  version: 1
covers:
  - symbol: capitalize
    kind: function
    at: 'apps/platform/utils/shared.ts:L5-L8'
  - symbol: toFixed
    kind: function
    at: 'apps/platform/utils/shared.ts:L10-L16'
  - symbol: Field
    kind: type
    at: 'apps/platform/utils/shared.ts:L18-L18'
  - symbol: sortStrings
    kind: function
    at: 'apps/platform/utils/shared.ts:L20-L20'
  - symbol: sortFields
    kind: function
    at: 'apps/platform/utils/shared.ts:L22-L38'
  - symbol: listAsSentence
    kind: function
    at: 'apps/platform/utils/shared.ts:L40-L45'
---

<!-- context:generated:start -->

## Summary

Reusable formatters for common data presentation tasks: capitalize, toFixed (numeric rounding), sortStrings (locale-aware), sortFields (object sorting by id/label), and listAsSentence (array-to-comma-separated text with i18n conjunctions). All functions include defensive type checking with safe fallbacks.

## Related

- depends on [[i18n-system]] — listAsSentence uses i18n t() function for localized 'and'/'or' conjunctions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
