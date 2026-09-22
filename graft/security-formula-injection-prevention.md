---
name: 'Security: Formula-Injection Prevention'
slug: security-formula-injection-prevention
type: concept
sources:
  - path: apps/platform/server/api/utils/sanitize.ts
    hash: c594105f5abdee7160bb8d71a3187d8f66ac28385fc525bc4e850ec2cfc00eff
sources_digest: b9538011e682bf1e211a8852c0ca8089b17b474ab77de400cba7c0d7a7087011
links: []
generator:
  version: 1
covers:
  - symbol: sanitizeSheetValue
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L17-L22'
  - symbol: sanitizeSheetRow
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L28-L34'
  - symbol: escapeFormulaString
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L41-L43'
---

<!-- context:generated:start -->

## Summary

Defense against CSV formula-injection attacks (CWE-1336) by prefixing user-supplied strings with a single quote if they start with formula-trigger chars (=, +, -, @, tab, CR), forcing Sheets to treat them as literal text. Applied at row-write time via sanitizeSheetValue and sanitizeSheetRow.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
