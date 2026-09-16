---
name: Guest User Factory
slug: guest-user-factory
type: file
sources:
  - path: libs/api-client/src/utils/guest.ts
    hash: b5740d0e4aa139075b1f062d83cb9c66c3ee0dc87032f46b209bdd74e7fb0983
sources_digest: 2d6183d8b332ede9c2c25095c3a8b0d5edb644085f68263c65b47894f57ad104
links: []
generator:
  version: 1
covers:
  - symbol: getGuestUser
    kind: function
    at: 'libs/api-client/src/utils/guest.ts:L7-L12'
---

<!-- context:generated:start -->

## Summary

Synchronous factory function getGuestUser() returning zero-ID UserData with guest type and anonymous permissions from config, supporting client-side and server-side rendering contexts. Lightweight fallback for unauthenticated sessions that mirrors async fetchGuestUser shape but resolves immediately without network calls.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
