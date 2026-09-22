---
name: User Profile & Settings Panel
slug: user-profile-settings-panel
type: system
sources:
  - path: apps/platform/features/_user/User.tsx
    hash: 1c22e3e7717b86076df94150fc179e6e70791f1ad3df2be334877d71aae86d03
  - path: apps/platform/features/_user/UserDatasets.tsx
    hash: 552dc6b6f7f79e2c08b9c7f585d8e6942203427a1a9259938d54e2e8a88c479a
  - path: apps/platform/features/_user/UserInfo.tsx
    hash: 64e61d4e7b176d9cd9a2aedd2fe29b43b793ea6506d96bfba3d7d468da7bbb50
  - path: apps/platform/features/_user/UserReports.tsx
    hash: 0b931351701ee33d38219bd574d802d5700718f29b952a84e0ec882a508a3024
  - path: apps/platform/features/_user/UserVesselGroups.tsx
    hash: 92189cd9840a79fed736238fb01ec4aa5dde41278807e69622a971b0711728bc
  - path: apps/platform/features/_user/UserWorkspaces.tsx
    hash: 5cbdb7e6082546b819b193c5f134d0bf82aba49db10ffe327605f51336b753fd
  - path: apps/platform/features/_user/UserWorkspacesPrivate.tsx
    hash: 5591c9276fcebf46684f5d729a98623adc8e4b7693ea718fefb45a06badc6ca1
  - path: apps/platform/features/_user/UserWorkspacesPublic.tsx
    hash: a7570558dcf01ee4ed744c0a7c5ce0d74f36728796cd1025bcfbf9afea4cb97a
sources_digest: d88dbccc9deaa671980e8a1b451c1d0d2653fa6886a45a7dc089876cc9f9b67a
links:
  - to: user-authorization-permissions-system
    relation: depends_on
    description: >-
      UserInfo uses selectUserData, selectIsGFWUser, and badge selectors;
      UserWorkspaces/UserDatasets/UserReports/UserVesselGroups all depend on
      selectUser* resource selectors
  - to: user-preference-persistence
    relation: depends_on
    description: >-
      UserInfo depends on user settings and language preference; SettingsButton
      navigates to external settings URL
  - to: vessel-groups-management-system
    relation: depends_on
    description: >-
      UserVesselGroups displays and manages vessel groups via
      selectUserVesselGroups, deleteVesselGroupThunk, and
      vessel-groups-migration.hooks
  - to: workspace-vessel-data-sync
    relation: depends_on
    description: >-
      User.tsx dispatches fetchWorkspacesThunk and fetchVesselGroupsThunk on
      mount; UserWorkspaces invokes useSetMapCoordinates; UserWorkspacesPublic
      triggers deleteWorkspaceThunk
generator:
  version: 1
covers:
  - symbol: User
    kind: function
    at: 'apps/platform/features/_user/User.tsx:L30-L107'
  - symbol: UserDatasets
    kind: function
    at: 'apps/platform/features/_user/UserDatasets.tsx:L52-L285'
  - symbol: onSearchQueryChange
    kind: function
    at: 'apps/platform/features/_user/UserDatasets.tsx:L114-L116'
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
  - symbol: getUserGuideReportLinkByLocale
    kind: function
    at: 'apps/platform/features/_user/UserReports.tsx:L26-L33'
  - symbol: UserReports
    kind: function
    at: 'apps/platform/features/_user/UserReports.tsx:L35-L139'
  - symbol: onSearchQueryChange
    kind: function
    at: 'apps/platform/features/_user/UserReports.tsx:L43-L45'
  - symbol: UserVesselGroups
    kind: function
    at: 'apps/platform/features/_user/UserVesselGroups.tsx:L41-L189'
  - symbol: onSearchQueryChange
    kind: function
    at: 'apps/platform/features/_user/UserVesselGroups.tsx:L58-L60'
  - symbol: UserWorkspaces
    kind: function
    at: 'apps/platform/features/_user/UserWorkspaces.tsx:L10-L31'
  - symbol: onSearchQueryChange
    kind: function
    at: 'apps/platform/features/_user/UserWorkspaces.tsx:L13-L15'
  - symbol: UserWorkspacesPrivate
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPrivate.tsx:L22-L79'
  - symbol: onWorkspaceClick
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPrivate.tsx:L29-L34'
  - symbol: UserWorkspacesPublic
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPublic.tsx:L29-L156'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPublic.tsx:L66-L68'
---

<!-- context:generated:start -->

## Summary

Main tabbed container (User.tsx) displaying authenticated user's profile info, workspaces, datasets, reports, and vessel groups. Each tab fetches and displays user-scoped resources via Redux selectors and thunks. Includes UserInfo (profile + badges), UserWorkspaces (private/public filtering), UserDatasets (CRUD + modal), UserReports (searchable list with delete), and UserVesselGroups (with migration UI).

## Related

- depends on [[user-authorization-permissions-system]] — UserInfo uses selectUserData, selectIsGFWUser, and badge selectors; UserWorkspaces/UserDatasets/UserReports/UserVesselGroups all depend on selectUser* resource selectors
- depends on [[user-preference-persistence]] — UserInfo depends on user settings and language preference; SettingsButton navigates to external settings URL
- depends on [[vessel-groups-management-system]] — UserVesselGroups displays and manages vessel groups via selectUserVesselGroups, deleteVesselGroupThunk, and vessel-groups-migration.hooks
- depends on [[workspace-vessel-data-sync]] — User.tsx dispatches fetchWorkspacesThunk and fetchVesselGroupsThunk on mount; UserWorkspaces invokes useSetMapCoordinates; UserWorkspacesPublic triggers deleteWorkspaceThunk

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
