---
name: URL Parameter Parsing
slug: url-parameter-parsing
type: file
sources:
  - path: apps/platform/utils/url.ts
    hash: cd678c1ab8f2c51e59a4631c280cd1e057a0afeda47aeba5491937f3c74bc9aa
sources_digest: 3986fef4d27d8cabe9eca0c521ec1797c7dfb4e9ca447d65e3a2675e4b165586
links: []
generator:
  version: 1
covers:
  - symbol: getUrlViewstateNumericParam
    kind: function
    at: 'apps/platform/utils/url.ts:L3-L11'
---

<!-- context:generated:start -->

## Summary

Safely extracts and parses numeric URL parameters from browser query strings. getUrlViewstateNumericParam retrieves a parameter by key, parses as float, returns null if unavailable/invalid/server-side. Depends on getIsBrowser() from utils/dom to prevent SSR errors.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
