---
name: User Authentication & Profile
slug: user-authentication-profile
type: system
sources:
  - path: apps/api-portal/src/features/user/user.ts
    hash: 639cf97e42054e969712af03cce8408ba1ba6b9e7f345fc9c8ae7ccfe98e5430
sources_digest: d95085718622d48544a5505c4c9447eb94d828a765bb94547f65fc3a75b32fde
links:
  - to: authenticated-layout-wrapper
    relation: produces
    description: >-
      useUser provides authorized flag and
      isUserApplicationsRequiredInfoCompleted selector
  - to: user-additional-profile-form
    relation: produces
    description: >-
      useUpdateUserAdditionalInformation mutation persists form data and
      navigates to home
  - to: user-applications-api-layer
    relation: uses
    description: >-
      checkUserApplicationPermission utility validates user action permissions
      on user-application entity
generator:
  version: 1
covers:
  - symbol: fetchUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L13-L21'
  - symbol: UserAction
    kind: type
    at: 'apps/api-portal/src/features/user/user.ts:L22-L22'
  - symbol: checkUserApplicationPermission
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L23-L29'
  - symbol: logoutUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L31-L33'
  - symbol: useUser
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L35-L77'
  - symbol: updateUserAdditionalFields
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L79-L93'
  - symbol: useUpdateUserAdditionalInformation
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L94-L103'
  - symbol: useUserAdditionalInformation
    kind: function
    at: 'apps/api-portal/src/features/user/user.ts:L105-L112'
---

<!-- context:generated:start -->

## Summary

Core feature for managing user login state, profile data, and permission checks. Wraps GFWAPI authentication endpoints and react-query caching, exposing useUser hook and profile mutation hooks for downstream components.

## Related

- produces [[authenticated-layout-wrapper]] — useUser provides authorized flag and isUserApplicationsRequiredInfoCompleted selector
- produces [[user-additional-profile-form]] — useUpdateUserAdditionalInformation mutation persists form data and navigates to home
- uses [[user-applications-api-layer]] — checkUserApplicationPermission utility validates user action permissions on user-application entity

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
