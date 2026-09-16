---
name: DOM and Storage Safety Utilities
slug: dom-and-storage-safety-utilities
type: file
sources:
  - path: apps/platform/utils/dom.ts
    hash: 501444a93d1972a4eecdf93ebb73b0e217ce4f804f762a07a28c18dbcea517ae
sources_digest: cbe9a08a6ba28734f66d04c93a2eedd8cd49967e54a5440cae09d35798e23de5
links: []
generator:
  version: 1
covers:
  - symbol: getIsBrowser
    kind: function
    at: 'apps/platform/utils/dom.ts:L1-L1'
  - symbol: getLocalStorage
    kind: function
    at: 'apps/platform/utils/dom.ts:L3-L13'
  - symbol: getLocalStorageItem
    kind: function
    at: 'apps/platform/utils/dom.ts:L15-L21'
  - symbol: setLocalStorageItem
    kind: function
    at: 'apps/platform/utils/dom.ts:L23-L29'
  - symbol: removeLocalStorageItem
    kind: function
    at: 'apps/platform/utils/dom.ts:L31-L37'
  - symbol: getSafeElementById
    kind: function
    at: 'apps/platform/utils/dom.ts:L39-L41'
  - symbol: getCSSVarValue
    kind: function
    at: 'apps/platform/utils/dom.ts:L43-L48'
---

<!-- context:generated:start -->

## Summary

Defensive wrappers for DOM and localStorage operations that guard against server-side rendering (SSR) contexts and blocked storage access. Exports getIsBrowser() to check window availability, and wrapped localStorage accessors (getLocalStorage, getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem) with silent error handling for graceful degradation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
