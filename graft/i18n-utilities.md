---
name: i18n Utilities
slug: i18n-utilities
type: system
sources:
  - path: apps/platform/features/i18n/utils.ts
    hash: 1c65390f364bd851296342da55216dc6dd1f2e2e07c28a6262d6f24e570ff2ce
sources_digest: d9989d190de76c5cd8bff42049f2f1e801b88a7fed10f44aa88c23782b0a3140
links:
  - to: dataset-utilities
    relation: uses
    description: Delegates to getDatasetLabel for dataset object rendering in placeholders
  - to: translation-localization
    relation: uses
    description: >-
      Depends on i18n translation function t() and multi-language placeholder
      rendering
generator:
  version: 1
covers:
  - symbol: PlaceholderBySelectionParams
    kind: type
    at: 'apps/platform/features/i18n/utils.ts:L9-L13'
  - symbol: getPlaceholderBySelections
    kind: function
    at: 'apps/platform/features/i18n/utils.ts:L14-L38'
  - symbol: joinTranslatedList
    kind: function
    at: 'apps/platform/features/i18n/utils.ts:L40-L50'
---

<!-- context:generated:start -->

## Summary

Provides context-aware placeholder generation for multi-select filters and localized list joining. Supports both simple text and dataset-aware labels through filter operator logic that inverts exclusion expectations (no-selection-in-exclude-mode means all included).

## Related

- uses [[dataset-utilities]] — Delegates to getDatasetLabel for dataset object rendering in placeholders
- uses [[translation-localization]] — Depends on i18n translation function t() and multi-language placeholder rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
