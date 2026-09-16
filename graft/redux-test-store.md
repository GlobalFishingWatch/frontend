---
name: Redux Test Store
slug: redux-test-store
type: system
sources:
  - path: apps/platform/test/utils/store/factory.ts
    hash: 8f30fad2e74defdee98e631bfda7bb8697e94216980455fa0745666eb8703955
  - path: apps/platform/test/utils/store/fixtures.ts
    hash: f2e3480962306f4a41e327b50d86099abf1fae416386912ef456a2d55dfc9072
  - path: apps/platform/test/utils/store/index.ts
    hash: 81c6e779eb1a5ad1cf5e1c5923ffeb207d9f968004b688852c6e743f96f6e011
  - path: apps/platform/test/utils/store/state.ts
    hash: 261077177b971e0051a7ee3a59102068190b3ab2d9bfeeddd35b84482f97f378
  - path: apps/platform/test/utils/store/testing-store-middleware.spec.ts
    hash: b3586fa1cbcf57494011f7fbe69ef8d41cc3c20e65f48078ce52a2814e7a3fa2
  - path: apps/platform/test/utils/store/testing-store-middleware.ts
    hash: a8ae3a5ba0d0d70b7132d86fa480b9f27dce381785649a134cfd6b33289c6d2f
sources_digest: af8034d7b663b178279c992ea320ff16a0a9b126f565d1905cd2f5e05725057e
links:
  - to: application-type-definitions
    relation: depends_on
    description: Store fixtures depend on WorkspaceState and QueryParams type definitions
generator:
  version: 1
covers:
  - symbol: DefaultState
    kind: type
    at: 'apps/platform/test/utils/store/factory.ts:L12-L12'
  - symbol: DatasetsState
    kind: type
    at: 'apps/platform/test/utils/store/factory.ts:L13-L13'
  - symbol: DeepPartial
    kind: type
    at: 'apps/platform/test/utils/store/factory.ts:L14-L14'
  - symbol: EagerSliceName
    kind: type
    at: 'apps/platform/test/utils/store/factory.ts:L25-L30'
  - symbol: _FixtureKeysAreEager
    kind: type
    at: 'apps/platform/test/utils/store/factory.ts:L33-L33'
  - symbol: getDefaultState
    kind: function
    at: 'apps/platform/test/utils/store/factory.ts:L35-L49'
  - symbol: getDefaultStateWithDatasets
    kind: function
    at: 'apps/platform/test/utils/store/factory.ts:L51-L70'
  - symbol: getDefaultViewportProperty
    kind: function
    at: 'apps/platform/test/utils/store/factory.ts:L74-L79'
  - symbol: ActionMatcher
    kind: type
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L5-L10'
  - symbol: TestingStoreMiddleware
    kind: class
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L12-L106'
  - symbol: setFilterMiddlewareRegistered
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L17-L19'
  - symbol: clear
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L21-L24'
  - symbol: getActions
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L26-L31'
  - symbol: getActionsByType
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L33-L38'
  - symbol: getLastActionByType
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L40-L46'
  - symbol: wasActionDispatched
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L48-L50'
  - symbol: waitForAction
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L52-L78'
  - symbol: removeActionListener
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L80-L85'
  - symbol: createMiddleware
    kind: method
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L87-L105'
  - symbol: createTestingMiddleware
    kind: function
    at: 'apps/platform/test/utils/store/testing-store-middleware.ts:L108-L110'
---

<!-- context:generated:start -->

## Summary

Provides Redux store initialization and state inspection utilities for testing. Includes factory functions for generating preloaded state with optional overrides, test fixtures for dataset entities, middleware for intercepting dispatched actions, and a canonical default state fixture documenting all platform datasets and context layers.

## Related

- depends on [[application-type-definitions]] — Store fixtures depend on WorkspaceState and QueryParams type definitions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
