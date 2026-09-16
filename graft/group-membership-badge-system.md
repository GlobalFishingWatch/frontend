---
name: Group Membership & Badge System
slug: group-membership-badge-system
type: concept
sources:
  - path: apps/platform/features/_user/selectors/user.selectors.ts
    hash: 51dd68ba60283e3b7942afd1a8ca2603c6657e188f7c7acecb79e3218fba2bcc
  - path: apps/platform/features/_user/UserInfo.tsx
    hash: 64e61d4e7b176d9cd9a2aedd2fe29b43b793ea6506d96bfba3d7d468da7bbb50
sources_digest: 017f6e297689ab60551efd961fb6680a509306e84e4f1dc18f1ddf3f93fa3715
links:
  - to: user-authorization-permissions-system
    relation: part_of
    description: >-
      Badge and group selectors derive from selectUserGroups and are rendered in
      UserInfo tab
generator:
  version: 1
covers:
  - symbol: Badge
    kind: type
    at: 'apps/platform/features/_user/UserInfo.tsx:L38-L38'
  - symbol: BadgeInfo
    kind: type
    at: 'apps/platform/features/_user/UserInfo.tsx:L39-L39'
  - symbol: UserInfo
    kind: function
    at: 'apps/platform/features/_user/UserInfo.tsx:L41-L186'
  - symbol: onBadgeClick
    kind: function
    at: 'apps/platform/features/_user/UserInfo.tsx:L56-L58'
  - symbol: onBadgeModalClose
    kind: function
    at: 'apps/platform/features/_user/UserInfo.tsx:L59-L61'
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

Users belong to groups (GFW, JAC, admin, test) identified by normalized lowercase group IDs. selectUserGroups normalizes group names; selectIsGFWAdminUser uses case-insensitive comparison (suggesting backend inconsistency), while others use direct includes. BadgeInfo types map groups to earned achievement badges (ambassador, teacher, presenter, fixer, impact reporter) with modal details; selectHas*Badge selectors check BADGES_GROUP_PREFIX.

## Related

- part of [[user-authorization-permissions-system]] — Badge and group selectors derive from selectUserGroups and are rendered in UserInfo tab

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
