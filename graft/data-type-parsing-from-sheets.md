---
name: Data Type Parsing from Sheets
slug: data-type-parsing-from-sheets
type: concept
sources:
  - path: apps/platform/server/api/track-corrections/utils.ts
    hash: e954307a173535a4953ba09533c6d6d90ecba54ae8cd21d87133e31530362fa4
sources_digest: a5a59400b1325af6bf32c4527b638b5fe3dc315c7fbeef42d23c1f48c9bce230
links: []
generator:
  version: 1
covers:
  - symbol: parseIssueResolved
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L11-L13'
  - symbol: parseIssueComment
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L15-L30'
  - symbol: parseIssueRow
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L32-L50'
  - symbol: getSheetTab
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L52-L58'
---

<!-- context:generated:start -->

## Summary

Utility functions (parseIssueRow, parseIssueComment, parseIssueResolved) transform raw Google Sheet rows into typed objects, handling string-to-boolean/number/float conversions. Inconsistency: latitude/longitude parsed as floats, other numeric fields left unparsed, suggesting downstream handler variability.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
