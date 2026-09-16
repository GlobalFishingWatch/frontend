---
name: API Request Test Utilities
slug: api-request-test-utilities
type: file
sources:
  - path: apps/platform/test/utils/network/gfw-api-test.ts
    hash: ef2539629d6c90b6db3a6dd3362a4ed476de00accc76d29879b674905f21905e
sources_digest: ac0c9845e8408310de95d5a00171fadf53e05921c202382bafcaaf612232eb67
links:
  - to: redux-test-store
    relation: uses
    description: >-
      Tests using GFWAPITestUtils often verify state updates triggered by API
      responses
generator:
  version: 1
covers:
  - symbol: GFWFetchSpy
    kind: type
    at: 'apps/platform/test/utils/network/gfw-api-test.ts:L8-L8'
  - symbol: GFWAPITestUtils
    kind: class
    at: 'apps/platform/test/utils/network/gfw-api-test.ts:L15-L41'
  - symbol: constructor
    kind: method
    at: 'apps/platform/test/utils/network/gfw-api-test.ts:L18-L20'
  - symbol: waitForRequest
    kind: method
    at: 'apps/platform/test/utils/network/gfw-api-test.ts:L22-L40'
---

<!-- context:generated:start -->

## Summary

Testing utilities for verifying API requests made through the Global Fishing Watch API client. Wraps GFWAPI.fetch with Vitest spies to enable assertions on network calls without mocking the HTTP layer. Supports filtering by URL substring and async waiting for request completion.

## Related

- uses [[redux-test-store]] — Tests using GFWAPITestUtils often verify state updates triggered by API responses

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
