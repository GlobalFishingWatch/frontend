---
name: Error Handling Cross-Environment Resilience
slug: error-handling-cross-environment-resilience
type: concept
sources:
  - path: libs/api-client/src/utils/browser.ts
    hash: 72c2556c83a5d8f32da4d2033e23811ada748a6d76cd9657aac057d1f7ea85ca
  - path: libs/api-client/src/utils/cookies.ts
    hash: 4e79e286982ae0d76cd8ec1d54eb361ee42e829a037d9502a7d315e4b54dd058
  - path: libs/api-client/src/utils/errors.ts
    hash: c14719f702537ce35acf53aab00a10a103b5b6b8c43dcc8e830eac918cb2f796
  - path: libs/api-client/src/utils/parse.ts
    hash: 8ee149ba598f7591080c1fceef86ef68ecf556265573c470eff9e9b55bc530da
sources_digest: faa41ace2eaad1df717517defec2ea4fb02b6d469692933eeb27014083e747ba
links:
  - to: api-client-browser-utilities
    relation: part_of
    description: Defensive error handling is foundational pattern throughout browser client
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
  - symbol: V2MetadataError
    kind: type
    at: 'libs/api-client/src/utils/errors.ts:L3-L3'
  - symbol: V2MessageError
    kind: interface
    at: 'libs/api-client/src/utils/errors.ts:L4-L8'
  - symbol: ResponseError
    kind: interface
    at: 'libs/api-client/src/utils/errors.ts:L9-L13'
  - symbol: getIsUnauthorizedError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L15-L16'
  - symbol: getIsConcurrentError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L18-L19'
  - symbol: getIsTimeoutError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L27-L30'
  - symbol: parseAPIErrorStatus
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L32-L34'
  - symbol: parseAPIErrorMessage
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L36-L41'
  - symbol: parseAPIErrorMetadata
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L43-L48'
  - symbol: ParsedAPIError
    kind: type
    at: 'libs/api-client/src/utils/errors.ts:L50-L55'
  - symbol: parseAPIError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L56-L66'
  - symbol: isUnauthorized
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L68-L70'
  - symbol: isForbidden
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L72-L74'
  - symbol: isAuthError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L76-L78'
  - symbol: isSessionError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L88-L93'
  - symbol: isTransientError
    kind: function
    at: 'libs/api-client/src/utils/errors.ts:L95-L99'
  - symbol: processStatus
    kind: function
    at: 'libs/api-client/src/utils/parse.ts:L3-L43'
  - symbol: parseJSON
    kind: function
    at: 'libs/api-client/src/utils/parse.ts:L45-L45'
---

<!-- context:generated:start -->

## Summary

Defensive error handling permeates browser utilities to work reliably across edge cases: safeLocalStorage wraps native localStorage with comprehensive exception handling for restricted contexts (Android WebViews with disabled DOM storage, sandboxed iframes throwing SecurityError); getIsBrowser performs minimal checks for browser context; cookie operations gracefully no-op on server side. Same philosophy in response parsing where processStatus converts error responses to structured objects supporting both singular and plural messages for backward compatibility. Errors parsed and classified to distinguish recoverable (timeouts, 5xx) from permanent (auth failures) to guide retry logic. Design philosophy: all utilities prevent throwing uncaught exceptions in restricted contexts.

## Related

- part of [[api-client-browser-utilities]] — Defensive error handling is foundational pattern throughout browser client

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
