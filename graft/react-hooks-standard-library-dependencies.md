---
name: React Hooks Standard Library Dependencies
slug: react-hooks-standard-library-dependencies
type: concept
sources:
  - path: libs/react-hooks/src/use-analytics/use-analytics.ts
    hash: 248f16f2f663cf3405684fec3696a278b674892d0a16ccca461ddffc957c987e
  - path: libs/react-hooks/src/use-debounce/use-debounce.ts
    hash: 78a8f70baa0ac482a8d381f77e6c8db5d1b0fad58e5549c0e70d0ed025ce6670
  - path: libs/react-hooks/src/use-local-storage/use-local-storage.ts
    hash: 643020ddb47f830427552d177e21f01747572501c11a4dc5da7a6ebb174caa9d
  - path: libs/react-hooks/src/use-login/use-login.ts
    hash: 50c78dacc62f0472eb6a846f2a7035b9829e656c9aa7ea401afced90f769a47c
  - path: libs/react-hooks/src/use-memo-compare/use-memo-compare.ts
    hash: 96eed100e869627240a04b78e9a95d0ca30aaa688a1c792c3c73224d0c82b5ce
sources_digest: c0d4334bdcec3b44e3abe23baff07db15d9cc48c8ef016b92d8d733b6468bac6
links: []
generator:
  version: 1
covers:
  - symbol: InitOptions
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L5-L5'
  - symbol: ReactGAClient
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L7-L12'
  - symbol: resolveReactGAClient
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L14-L23'
  - symbol: getReactGAClient
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L29-L38'
  - symbol: TrackCategory
    kind: enum
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L40-L42'
  - symbol: TrackEventParams
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L44-L50'
  - symbol: trackEvent
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L52-L84'
  - symbol: useAnalyticsParams
    kind: type
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L86-L91'
  - symbol: useAnalyticsInit
    kind: function
    at: 'libs/react-hooks/src/use-analytics/use-analytics.ts:L93-L154'
  - symbol: useDebounce
    kind: function
    at: 'libs/react-hooks/src/use-debounce/use-debounce.ts:L4-L33'
  - symbol: GFWLoginHook
    kind: interface
    at: 'libs/react-hooks/src/use-login/use-login.ts:L10-L15'
  - symbol: useGFWLoginRedirect
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L17-L21'
  - symbol: useGFWLogin
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L23-L50'
  - symbol: logoutUser
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L52-L55'
  - symbol: useMemoCompare
    kind: function
    at: 'libs/react-hooks/src/use-memo-compare/use-memo-compare.ts:L5-L23'
---

<!-- context:generated:start -->

## Summary

Hooks delegate to established external libraries rather than reinvent: es-toolkit provides debounce, snakeCase, and isEqual utilities; usehooks-ts wraps localStorage/sessionStorage; react-ga4 handles GA integration; @globalfishingwatch/api-client manages GFW authentication and token utilities; Turf.js (in simplify module) handles geometry operations. Architectural choice to avoid duplicating mature implementations and maintain consistency across team dependencies.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
