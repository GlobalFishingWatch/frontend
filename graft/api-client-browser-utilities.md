---
name: API Client Browser Utilities
slug: api-client-browser-utilities
type: system
sources:
  - path: libs/api-client/src/utils/browser.ts
    hash: 72c2556c83a5d8f32da4d2033e23811ada748a6d76cd9657aac057d1f7ea85ca
  - path: libs/api-client/src/utils/cookies.ts
    hash: 4e79e286982ae0d76cd8ec1d54eb361ee42e829a037d9502a7d315e4b54dd058
  - path: libs/api-client/src/utils/token-storage.ts
    hash: a21514e671c9732647bc4f7df8d2d875e5b5f83baaffdb16136acea66d795133
sources_digest: c5c157e1b346c1d47922e3e91a0e016d72bb2344dc962279e0af04636a2a80d3
links:
  - to: environment-resolution
    relation: depends_on
    description: >-
      Browser detection checks complement environment variable resolution for
      runtime context determination
  - to: url-parameter-manipulation
    relation: uses
    description: >-
      Token storage utilities interact with URL parameter extraction for access
      token flow
generator:
  version: 1
covers:
  - symbol: getIsBrowser
    kind: function
    at: 'libs/api-client/src/utils/browser.ts:L1-L1'
  - symbol: logDebugUrl
    kind: function
    at: 'libs/api-client/src/utils/browser.ts:L32-L46'
  - symbol: readCookieString
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L3-L6'
  - symbol: CookieType
    kind: type
    at: 'libs/api-client/src/utils/cookies.ts:L8-L8'
  - symbol: NumberCookieArgs
    kind: type
    at: 'libs/api-client/src/utils/cookies.ts:L9-L9'
  - symbol: ObjectCookieArgs
    kind: type
    at: 'libs/api-client/src/utils/cookies.ts:L10-L10'
  - symbol: StringCookieArgs
    kind: type
    at: 'libs/api-client/src/utils/cookies.ts:L11-L11'
  - symbol: ReadCookieArgs
    kind: type
    at: 'libs/api-client/src/utils/cookies.ts:L12-L12'
  - symbol: parseCookieValue
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L14-L34'
  - symbol: readCookie
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L39-L45'
  - symbol: readDocumentCookie
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L50-L56'
  - symbol: writeDocumentCookie
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L60-L67'
  - symbol: writeDocumentCookieJSON
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L69-L76'
  - symbol: removeDocumentCookie
    kind: function
    at: 'libs/api-client/src/utils/cookies.ts:L78-L81'
  - symbol: TokenStorage
    kind: interface
    at: 'libs/api-client/src/utils/token-storage.ts:L4-L7'
  - symbol: createLocalStorageTokenStorage
    kind: function
    at: 'libs/api-client/src/utils/token-storage.ts:L9-L18'
  - symbol: createCookieTokenStorage
    kind: function
    at: 'libs/api-client/src/utils/token-storage.ts:L20-L30'
---

<!-- context:generated:start -->

## Summary

Cross-browser compatibility and error handling utilities for the API client. Provides secure localStorage access with fallback for restricted contexts (WebViews, iframes), detects browser environment safely, logs oversized URLs with automatic truncation, and wraps document.cookie operations with comprehensive exception handling for isomorphic contexts.

## Related

- depends on [[environment-resolution]] — Browser detection checks complement environment variable resolution for runtime context determination
- uses [[url-parameter-manipulation]] — Token storage utilities interact with URL parameter extraction for access token flow

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
