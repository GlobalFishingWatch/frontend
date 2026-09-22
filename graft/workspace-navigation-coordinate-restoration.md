---
name: Workspace Navigation & Coordinate Restoration
slug: workspace-navigation-coordinate-restoration
type: concept
sources:
  - path: apps/platform/features/_user/LogoutButton.tsx
    hash: e2a2048c27292fe9eaa5ad272f451a7e4e1f709348dadaf310ac02808f6f3142
  - path: apps/platform/features/_user/UserWorkspacesPrivate.tsx
    hash: 5591c9276fcebf46684f5d729a98623adc8e4b7693ea718fefb45a06badc6ca1
  - path: apps/platform/features/_user/UserWorkspacesPublic.tsx
    hash: a7570558dcf01ee4ed744c0a7c5ce0d74f36728796cd1025bcfbf9afea4cb97a
sources_digest: 71474d6d903541cf73a269b54454a0954878414cc0cb22cd19d6ebd7491b5d28
links:
  - to: user-profile-settings-panel
    relation: part_of
    description: Workspace navigation is part of UserWorkspaces tab and logout flow
generator:
  version: 1
covers:
  - symbol: LogoutButton
    kind: function
    at: 'apps/platform/features/_user/LogoutButton.tsx:L20-L74'
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

Workspaces store viewport (map.viewport property) and other navigation context. useSetMapCoordinates hook and setMapCoordinates function restore viewport when users click workspace links. useReplaceQueryParams syncs URL params. UserWorkspacesPrivate/Public call setMapCoordinates and replaceQueryParams on workspace click; LogoutButton restores last workspace via selectLastWorkspaceNavigationProps and TanStack Router navigation.

## Related

- part of [[user-profile-settings-panel]] — Workspace navigation is part of UserWorkspaces tab and logout flow

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
