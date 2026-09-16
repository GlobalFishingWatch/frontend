---
name: User Groups Administration System
slug: user-groups-administration-system
type: system
sources:
  - path: apps/user-groups-admin/src/app/App.tsx
    hash: 895086c8456ccc7002c511d452acc40af1290c009f0b583692956be43538f52d
  - path: apps/user-groups-admin/src/components/header/header.tsx
    hash: 6d57611a3f3501e3935a3a1c976f81c2b0df354ce9501d53a02f835ed7703995
  - path: apps/user-groups-admin/src/components/layout/Layout.tsx
    hash: a686f3d6ca83f97141412c15d57811f12e342b2dfa8b04b133444a0752dff4f5
  - path: apps/user-groups-admin/src/components/user-groups/Detail.tsx
    hash: 8a96f85dab919ded4a6eb294899923079b05c532e1706a954ea94e5332c2834f
  - path: apps/user-groups-admin/src/components/user-groups/List.tsx
    hash: d4ddbaf2ed9eae40c16d768b2b180ac4b367b21cb869facbb60282145f354000
  - path: apps/user-groups-admin/src/main.tsx
    hash: 553d8b61332a2c1df32aa3a636527b9ae1312c69a5f97825b2d1016bb7e2a5d6
sources_digest: a2dedc31e562dd7d0306620c4366977aa2927f1762f8d43091d5c6bbaa8847c8
links:
  - to: global-fishing-watch-api-client
    relation: uses
    description: >-
      Detail and List components call GFWAPI.fetch for user-groups, users, and
      future-users endpoints; manage memberships via POST/DELETE
  - to: user-groups-authentication
    relation: depends_on
    description: >-
      Layout component uses useGFWLogin hook; Detail component respects group
      admin permissions before rendering management UI
generator:
  version: 1
covers:
  - symbol: Home
    kind: function
    at: 'apps/user-groups-admin/src/app/App.tsx:L8-L20'
  - symbol: HeaderProps
    kind: type
    at: 'apps/user-groups-admin/src/components/header/header.tsx:L6-L10'
  - symbol: Header
    kind: function
    at: 'apps/user-groups-admin/src/components/header/header.tsx:L12-L31'
  - symbol: Layout
    kind: function
    at: 'apps/user-groups-admin/src/components/layout/Layout.tsx:L11-L39'
  - symbol: onLogoutClick
    kind: function
    at: 'apps/user-groups-admin/src/components/layout/Layout.tsx:L15-L21'
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

Web application for managing user group membership and invitations via REST APIs. Supports searching/filtering groups, viewing active users, managing invitations with notes, and CSV export. Distinguishes between system groups (admin, anonymous) and badge-prefixed groups based on user role.

## Related

- uses [[global-fishing-watch-api-client]] — Detail and List components call GFWAPI.fetch for user-groups, users, and future-users endpoints; manage memberships via POST/DELETE
- depends on [[user-groups-authentication]] — Layout component uses useGFWLogin hook; Detail component respects group admin permissions before rendering management UI

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
