---
name: Google Sheets API Integration
slug: google-sheets-api-integration
type: system
sources:
  - path: apps/platform/server/api/utils/spreadsheets.ts
    hash: 4c3307c6a97ff6458f251bbe8d69d84ba7a5dbdb496da24f29dc0f831447b150
sources_digest: 6a63d23f57a021fb7e537c3fdba81b703ee832c69e8bdbe5637a175d974f3d2e
links:
  - to: google-sheets-data-persistence
    relation: implements
    description: >-
      Provides low-level sheet loading and authentication that all Sheets-backed
      APIs depend on
generator:
  version: 1
covers:
  - symbol: loadSpreadsheetDoc
    kind: function
    at: 'apps/platform/server/api/utils/spreadsheets.ts:L9-L25'
  - symbol: loadSpreadsheetDocByWorkspace
    kind: function
    at: 'apps/platform/server/api/utils/spreadsheets.ts:L27-L38'
---

<!-- context:generated:start -->

## Summary

Server-side utilities for authenticated Google Sheets access, handling JWT service account authentication, sheet loading by workspace, and utility wrappers for common sheet operations.

## Related

- implements [[google-sheets-data-persistence]] — Provides low-level sheet loading and authentication that all Sheets-backed APIs depend on

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
