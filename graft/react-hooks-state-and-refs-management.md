---
name: React Hooks State and Refs Management
slug: react-hooks-state-and-refs-management
type: concept
sources:
  - path: libs/react-hooks/src/use-memo-compare/use-memo-compare.ts
    hash: 96eed100e869627240a04b78e9a95d0ca30aaa688a1c792c3c73224d0c82b5ce
  - path: libs/react-hooks/src/use-previous/use-previous.ts
    hash: b3babc17f55686f3b825edbc37826d187cafecf59568092293a2f7a66895b7a9
  - path: libs/react-hooks/src/use-state-callback/use-state-callback.ts
    hash: 1a6c9ed7c6cf86d30eb672d3deeb9e2f24449e8e19d94bf12acfdd18c25fea0b
  - path: >-
      libs/react-hooks/src/use-track-dependencies-changes/use-track-dependencies-changes.ts
    hash: b730895a255757f432244ede6e56d7eb819de4df7087e00851749f2c8ad69ec2
sources_digest: 645365acb7de83361a211febc9940b95f8a7c88348913160b2f883e35ec65756
links: []
generator:
  version: 1
covers:
  - symbol: useMemoCompare
    kind: function
    at: 'libs/react-hooks/src/use-memo-compare/use-memo-compare.ts:L5-L23'
  - symbol: usePrevious
    kind: function
    at: 'libs/react-hooks/src/use-previous/use-previous.ts:L3-L11'
  - symbol: OnUpdateCallback
    kind: type
    at: 'libs/react-hooks/src/use-state-callback/use-state-callback.ts:L3-L3'
  - symbol: SetStateUpdaterCallback
    kind: type
    at: 'libs/react-hooks/src/use-state-callback/use-state-callback.ts:L4-L4'
  - symbol: SetStateAction
    kind: type
    at: 'libs/react-hooks/src/use-state-callback/use-state-callback.ts:L5-L8'
  - symbol: useStateCallback
    kind: function
    at: 'libs/react-hooks/src/use-state-callback/use-state-callback.ts:L14-L31'
  - symbol: setCustomState
    kind: function
    at: 'libs/react-hooks/src/use-state-callback/use-state-callback.ts:L18-L21'
  - symbol: useTrackDependencyChanges
    kind: function
    at: >-
      libs/react-hooks/src/use-track-dependencies-changes/use-track-dependencies-changes.ts:L3-L29
---

<!-- context:generated:start -->

## Summary

Primitives for stabilizing state across renders: useMemoCompare tracks previous values using custom comparator (default: deep equality) and returns memoized reference when equal; useStateCallback extends useState with optional callback fired after state commit; usePrevious returns prior render's value (intentionally lags one cycle); useTrackDependencyChanges logs which dependencies changed between renders using Object.is for equality, dev-only via NODE_ENV guard. Design trades standard ESLint compliance for specific debugging/stability behaviors via eslint-disable comments.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
