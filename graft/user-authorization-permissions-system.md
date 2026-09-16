---
name: User Authorization & Permissions System
slug: user-authorization-permissions-system
type: system
sources:
  - path: apps/platform/features/_user/selectors/user.groups.selectors.ts
    hash: b2f0daa11bcb101c562bfe0d90285ef68663d4e3caaa49091f27ae3fd7f4cb9e
  - path: apps/platform/features/_user/selectors/user.permissions.selectors.ts
    hash: 50601fa83b1a4eb1236c7ce3c95302d1ae9801e8ca7f1cab151fba1714a5673e
  - path: apps/platform/features/_user/selectors/user.selectors.ts
    hash: 51dd68ba60283e3b7942afd1a8ca2603c6657e188f7c7acecb79e3218fba2bcc
  - path: apps/platform/features/_user/user.config.ts
    hash: ee9f3c6c7d165c68963882a0ce226bd2950b93c74c07a9d7c6d528c8700758d0
sources_digest: 3d1d2aa59eb90339bfb953ee79da9e861bfd107e2522a945ecafded1ca7d3023
links:
  - to: login-ui-components
    relation: produces
    description: >-
      selectIsGuestUser and selectIsUserExpired gate access to protected
      features, triggering LoginLink wrapping in components like
      UserLoggedIconButton and LoginButtonWrapper
  - to: user-authentication-session-management
    relation: depends_on
    description: >-
      Reads selectUserData and user.type from user.slice to determine guest
      status, group membership, and derive role-based selectors like
      selectIsGFWUser, selectIsGFWAdminUser
  - to: user-profile-settings-panel
    relation: produces
    description: >-
      selectUserWorkspaces, selectUserDatasets, selectUserReports,
      selectUserVesselGroups populate the User.tsx tabbed interface with
      user-scoped resources
generator:
  version: 1
covers:
  - symbol: hasUserPermission
    kind: function
    at: >-
      apps/platform/features/_user/selectors/user.permissions.selectors.ts:L23-L27
  - symbol: selectUserDatasetsByCategory
    kind: function
    at: >-
      apps/platform/features/_user/selectors/user.permissions.selectors.ts:L142-L145
  - symbol: selectUserData
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L14-L14'
  - symbol: selectUserLogged
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L15-L15'
  - symbol: selectIsUserExpired
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L16-L16'
  - symbol: selectUserSettings
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L17-L17'
  - symbol: selectUserLanguage
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L18-L18'
  - symbol: selectLoginSource
    kind: function
    at: 'apps/platform/features/_user/selectors/user.selectors.ts:L19-L19'
---

<!-- context:generated:start -->

## Summary

Provides memoized Redux selectors that derive user roles, group memberships, and resource ownership (workspaces, datasets, reports, vessel groups) from user.slice state. Implements permission checking via checkExistPermissionInList, private group filtering via PRIVATE_SUPPORTED_GROUPS, and case-insensitive group normalization.

## Related

- produces [[login-ui-components]] — selectIsGuestUser and selectIsUserExpired gate access to protected features, triggering LoginLink wrapping in components like UserLoggedIconButton and LoginButtonWrapper
- depends on [[user-authentication-session-management]] — Reads selectUserData and user.type from user.slice to determine guest status, group membership, and derive role-based selectors like selectIsGFWUser, selectIsGFWAdminUser
- produces [[user-profile-settings-panel]] — selectUserWorkspaces, selectUserDatasets, selectUserReports, selectUserVesselGroups populate the User.tsx tabbed interface with user-scoped resources

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
