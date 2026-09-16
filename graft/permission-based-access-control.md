---
name: Permission-Based Access Control
slug: permission-based-access-control
type: concept
sources:
  - path: apps/track-labeler/src/features/user/user.hooks.ts
    hash: bef358541b54f4c4195721ed5920b4f311004a41e7ad741066e1807a3b06225e
  - path: apps/user-groups-admin/src/components/user-groups/Detail.tsx
    hash: 8a96f85dab919ded4a6eb294899923079b05c532e1706a954ea94e5332c2834f
  - path: apps/user-groups-admin/src/components/user-groups/List.tsx
    hash: d4ddbaf2ed9eae40c16d768b2b180ac4b367b21cb869facbb60282145f354000
sources_digest: 9c4f34086904feacbc9f5d7af016bb6009c66afc1b9bcd12c2bfff22b081de22
links:
  - to: track-labeler-user-authentication
    relation: part_of
    description: >-
      User slice stores decoded JWT and permission claims; hooks check
      permissions against LABELER_LOAD_PERMISSION constant
  - to: user-groups-administration-system
    relation: validates
    description: >-
      Admin and badge-prefixed groups are visible only to users in those groups;
      membership changes are checked before GFWAPI calls
  - to: workspace-and-project-configuration
    relation: implements
    description: >-
      Project list is filtered based on user permissions; projects in PROJECTS
      config require matching permission strings
generator:
  version: 1
covers:
  - symbol: UserHookType
    kind: interface
    at: 'apps/track-labeler/src/features/user/user.hooks.ts:L14-L20'
  - symbol: useUser
    kind: function
    at: 'apps/track-labeler/src/features/user/user.hooks.ts:L22-L49'
  - symbol: UserGroupDetail
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/Detail.tsx:L10-L237'
  - symbol: onAddUserClick
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/Detail.tsx:L38-L64'
  - symbol: onRemoveUserClick
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/Detail.tsx:L78-L88'
  - symbol: onDownloadCsvClick
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/Detail.tsx:L90-L110'
  - symbol: onRemoveFutureUserClick
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/Detail.tsx:L112-L124'
  - symbol: UserGroupsListProps
    kind: type
    at: 'apps/user-groups-admin/src/components/user-groups/List.tsx:L16-L20'
  - symbol: UserGroupsList
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/List.tsx:L22-L81'
  - symbol: fetchGroups
    kind: function
    at: 'apps/user-groups-admin/src/components/user-groups/List.tsx:L25-L28'
---

<!-- context:generated:start -->

## Summary

Application-level and project-level access is gated via permission strings checked against user tokens. Users with LABELER_LOAD_PERMISSION can access the entire labeler; project-specific permissions filter the project list visible in the UI. Permissions are decoded from JWT or stored in user group metadata.

## Related

- part of [[track-labeler-user-authentication]] — User slice stores decoded JWT and permission claims; hooks check permissions against LABELER_LOAD_PERMISSION constant
- validates [[user-groups-administration-system]] — Admin and badge-prefixed groups are visible only to users in those groups; membership changes are checked before GFWAPI calls
- implements [[workspace-and-project-configuration]] — Project list is filtered based on user permissions; projects in PROJECTS config require matching permission strings

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
