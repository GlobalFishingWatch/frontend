---
name: Date Formatting
slug: date-formatting
type: file
sources:
  - path: apps/api-portal/src/lib/dates.ts
    hash: fb097302d328114490b7685e9e7e03ab6a9da77ec1f69dc8bb6d8945922df76d
sources_digest: a99182dbf0ea4a978313168d87612bea5dee236599d9fa67f270dd593bcca3a4
links: []
generator:
  version: 1
covers:
  - symbol: Locale
    kind: enum
    at: 'apps/api-portal/src/lib/dates.ts:L4-L8'
  - symbol: formatI18DateParams
    kind: type
    at: 'apps/api-portal/src/lib/dates.ts:L10-L14'
  - symbol: formatI18nDate
    kind: function
    at: 'apps/api-portal/src/lib/dates.ts:L16-L29'
---

<!-- context:generated:start -->

## Summary

Internationalized date formatting utilities using Luxon. Supports English, Spanish, and French locales with preset formats (DATE_MED, DATETIME_MED) or custom token-based strings; automatically appends UTC suffix for datetime formats.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
