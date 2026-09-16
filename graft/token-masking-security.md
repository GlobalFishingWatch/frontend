---
name: Token Masking & Security
slug: token-masking-security
type: concept
sources:
  - path: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx
    hash: da5d64803151723c74440486e037463f368d7fbd947a703d96d02ac66506049c
sources_digest: 510a59001973008148057b093e9bfa2ef630206c6ac55db3bbb0265f642bb57f
links: []
generator:
  version: 1
covers:
  - symbol: ActionMessage
    kind: type
    at: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx:L16-L19
  - symbol: AccessTokenList
    kind: function
    at: >-
      apps/api-portal/src/components/access-token/access-token-list/access-token-list.tsx:L21-L185
---

<!-- context:generated:start -->

## Summary

API tokens are masked by default in AccessTokenList—displaying only first 100 characters with blur styling—and revealed only after explicit user toggle. This balances security with usability by preventing accidental exposure while allowing full token access when needed.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
