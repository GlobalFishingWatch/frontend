---
name: URL Parameter Manipulation
slug: url-parameter-manipulation
type: file
sources:
  - path: libs/api-client/src/utils/url.ts
    hash: 5adb3f06ee23e23b9a344095254c86c4345bad9a6d22059a09325b78cf5ef7b9
sources_digest: b6f14938b6d49af44923448d58c1c59b2097d3926b2c4c64c019016ff703b99a
links:
  - to: api-client-browser-utilities
    relation: uses
    description: >-
      Token parameter wrappers depend on browser storage abstractions for
      persistence
generator:
  version: 1
covers:
  - symbol: isUrlAbsolute
    kind: function
    at: 'libs/api-client/src/utils/url.ts:L1-L6'
  - symbol: getURLParameterByName
    kind: function
    at: 'libs/api-client/src/utils/url.ts:L8-L15'
  - symbol: removeUrlParameterByName
    kind: function
    at: 'libs/api-client/src/utils/url.ts:L17-L29'
  - symbol: getAccessTokenFromUrl
    kind: function
    at: 'libs/api-client/src/utils/url.ts:L33-L35'
  - symbol: removeAccessTokenFromUrl
    kind: function
    at: 'libs/api-client/src/utils/url.ts:L37-L39'
---

<!-- context:generated:start -->

## Summary

Client-side URL utilities for query parameter extraction and manipulation using History API. Functions include isUrlAbsolute validation, getURLParameterByName with window.location defaulting, removeUrlParameterByName for clean URL updates, and ACCESS_TOKEN_STRING constant with convenience wrappers for token parameter handling. Regex-based parsing handles edge cases but lacks hash preservation.

## Related

- uses [[api-client-browser-utilities]] — Token parameter wrappers depend on browser storage abstractions for persistence

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
