---
name: Isomorphic Code Patterns for SSR
slug: isomorphic-code-patterns-for-ssr
type: concept
sources:
  - path: libs/api-client/src/utils/cookies.ts
    hash: 4e79e286982ae0d76cd8ec1d54eb361ee42e829a037d9502a7d315e4b54dd058
  - path: libs/api-client/src/utils/env.ts
    hash: 39c64bd2fe921cbbfc6b3fe5587f98832725ca74df0f728f7ab93431dd0e4679
  - path: libs/api-client/src/utils/guest.ts
    hash: b5740d0e4aa139075b1f062d83cb9c66c3ee0dc87032f46b209bdd74e7fb0983
  - path: libs/api-client/src/utils/token-storage.ts
    hash: a21514e671c9732647bc4f7df8d2d875e5b5f83baaffdb16136acea66d795133
sources_digest: 884257eba93bc0fe67372ac62fcb5c71e2daf05e536861a6ac9c42608703cffe
links:
  - to: api-client-browser-utilities
    relation: part_of
    description: >-
      Isomorphic patterns enable api-client library to work in both frontend and
      backend contexts
generator:
  version: 1
covers:
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
  - symbol: getEnv
    kind: function
    at: 'libs/api-client/src/utils/env.ts:L3-L15'
  - symbol: getGuestUser
    kind: function
    at: 'libs/api-client/src/utils/guest.ts:L7-L12'
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

Multiple modules support both browser and server contexts via defensive checks: environment resolution uses typeof checks on process object to safely detect Node.js; cookie operations check document availability before accessing DOM; token storage returns empty strings in SSR contexts rather than failing. Guest user factory resolves synchronously without network calls, suitable for server-side rendering. Design enables same TypeScript code to execute identically in browser bundles and Node.js servers without conditional compilation, though some modules (URL manipulation, browser detection) remain inherently client-side only.

## Related

- part of [[api-client-browser-utilities]] — Isomorphic patterns enable api-client library to work in both frontend and backend contexts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
