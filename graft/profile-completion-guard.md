---
name: Profile Completion Guard
slug: profile-completion-guard
type: system
sources:
  - path: >-
      apps/api-portal/src/components/require-additional-info/require-additional-info.spec.tsx
    hash: 4319cf89e4ee7b89670fa3119e594f94812eef6f3c7928dbebde7a61a2221663
  - path: >-
      apps/api-portal/src/components/require-additional-info/require-additional-info.tsx
    hash: 07cdc1b71296a107cd9a0f0503cf59b84ef318b07a84b7804a5d8249b70c4549
sources_digest: 02e16bf503a0db1924d1ae9a47329e718c77226018d7e143236eb6b36ff3bf1a
links:
  - to: user-authentication-profile
    relation: depends_on
    description: Checks isUserApplicationsRequiredInfoCompleted flag from useUser hook
generator:
  version: 1
covers:
  - symbol: RequireAdditionalInfoProps
    kind: interface
    at: >-
      apps/api-portal/src/components/require-additional-info/require-additional-info.tsx:L7-L9
  - symbol: RequireAdditionalInfo
    kind: function
    at: >-
      apps/api-portal/src/components/require-additional-info/require-additional-info.tsx:L11-L25
---

<!-- context:generated:start -->

## Summary

Route guard component that redirects users with incomplete API profiles to /signup. Tolerates initial loading states and only triggers redirect after isUserApplicationsRequiredInfoCompleted flag becomes defined.

## Related

- depends on [[user-authentication-profile]] — Checks isUserApplicationsRequiredInfoCompleted flag from useUser hook

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
