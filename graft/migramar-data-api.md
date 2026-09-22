---
name: Migramar Data API
slug: migramar-data-api
type: system
sources:
  - path: apps/platform/routes/api/migramar/$areaId.ts
    hash: 72f42f8e6ab557cd76abfc94a09a9b3335d0f90ddd51afb7273c147c923df2fb
  - path: apps/platform/routes/api/migramar/options.ts
    hash: c26471f38983d82e6b5c91d5e94711c93538c8d2a48b4bf7648162f0f60a58dc
sources_digest: d79ed9c62a3fc195e83b73b77aaeedff06e45a49346b790e1a81654917a8aa03
links:
  - to: google-sheets-api-integration
    relation: uses
    description: Both endpoints load MIGRAMAR_SPREADSHEET_ID sheet and extract/parse rows
generator:
  version: 1
covers:
  - symbol: MigramarRowYear
    kind: type
    at: 'apps/platform/routes/api/migramar/$areaId.ts:L5-L32'
  - symbol: MigramarRow
    kind: type
    at: 'apps/platform/routes/api/migramar/$areaId.ts:L34-L52'
  - symbol: MigramarApiResponse
    kind: type
    at: 'apps/platform/routes/api/migramar/$areaId.ts:L54-L54'
  - symbol: MigramarSpecies
    kind: type
    at: 'apps/platform/routes/api/migramar/options.ts:L5-L10'
  - symbol: MigramarIndicator
    kind: type
    at: 'apps/platform/routes/api/migramar/options.ts:L12-L18'
  - symbol: MigramarOptionsApiResponse
    kind: type
    at: 'apps/platform/routes/api/migramar/options.ts:L20-L22'
---

<!-- context:generated:start -->

## Summary

Server endpoints for serving migration and species-indicator projections from a Google Sheet: /api/migramar/$areaId returns filtered rows, /api/migramar/options provides dropdowns of species and indicators for UI selection.

## Related

- uses [[google-sheets-api-integration]] — Both endpoints load MIGRAMAR_SPREADSHEET_ID sheet and extract/parse rows

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
