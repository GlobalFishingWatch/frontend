---
name: User Authentication & Permissions
slug: user-authentication-permissions
type: system
sources:
  - path: apps/port-labeler/src/features/user/user.selectors.ts
    hash: c0814cc678de1f9e9abfbe2c1913abfedb4d223b17aa71a86fac2181f4a7df8e
  - path: apps/port-labeler/src/features/user/user.slice.ts
    hash: e8698806baeed2f4cf4d3318cb08e3d59d26d7b11f7cca53bb05ce3c59e689eb
sources_digest: 6f87d6b7e4d6e6afa45ccaaf8faa2b81a66a1d802c30e5b9e78f1f2df8d3233c
links:
  - to: authentication-api-token-management
    relation: produces
    description: >-
      User slice manages authentication state; token extraction and validation
      feed into GFWAPI credentials used by map tile requests
generator:
  version: 1
covers:
  - symbol: hasUserPermission
    kind: function
    at: 'apps/port-labeler/src/features/user/user.selectors.ts:L19-L23'
  - symbol: UserState
    kind: interface
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L14-L18'
  - symbol: selectUserData
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L85-L85'
  - symbol: selectUserStatus
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L86-L86'
  - symbol: selectUserLogged
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L87-L87'
  - symbol: selectIsGFWUser
    kind: function
    at: 'apps/port-labeler/src/features/user/user.slice.ts:L88-L89'
---

<!-- context:generated:start -->

## Summary

Manages user login/logout flows with guest fallback, tracks GFW staff group membership, and provides permission validation selectors. fetchUserThunk extracts access tokens from URL and calls GFWAPI for authentication; logoutUserThunk handles logout with optional redirect. Selectors check user logged status and specific permissions via checkExistPermissionInList utility.

## Related

- produces [[authentication-api-token-management]] — User slice manages authentication state; token extraction and validation feed into GFWAPI credentials used by map tile requests

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
