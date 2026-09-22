---
name: Authenticated Layout Wrapper
slug: authenticated-layout-wrapper
type: system
sources:
  - path: apps/api-portal/src/components/layout.tsx
    hash: 5d0988552530880c315734adec46239f615160b25b50c473b9f6b74f580178dc
sources_digest: 070e111cf65c75b9a4eb1bd463fcb0a29ef94ac94fabb09d761dfa871f7c0c54
links:
  - to: portal-configuration
    relation: depends_on
    description: References APPLICATION_NAME for support email link
  - to: user-authentication-profile
    relation: depends_on
    description: >-
      Uses useUser hook to check authentication, authorization, and guest user
      status
generator:
  version: 1
covers:
  - symbol: Layout
    kind: function
    at: 'apps/api-portal/src/components/layout.tsx:L13-L56'
---

<!-- context:generated:start -->

## Summary

Guard component that enforces user authentication and authorization. Displays spinner during auth checks, error message for unauthorized users, and renders children only for authenticated, authorized users. Constructs support mailto with user email.

## Related

- depends on [[portal-configuration]] — References APPLICATION_NAME for support email link
- depends on [[user-authentication-profile]] — Uses useUser hook to check authentication, authorization, and guest user status

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
