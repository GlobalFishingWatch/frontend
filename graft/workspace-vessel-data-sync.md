---
name: Workspace & Vessel Data Sync
slug: workspace-vessel-data-sync
type: concept
sources:
  - path: apps/platform/features/_user/LogoutButton.tsx
    hash: e2a2048c27292fe9eaa5ad272f451a7e4e1f709348dadaf310ac02808f6f3142
  - path: apps/platform/features/_user/user.hooks.ts
    hash: 983348a5e5e94012f09e707c52be932c5e2273a05249728b5eebac23f5b3f3cb
  - path: apps/platform/features/_user/user.slice.ts
    hash: dc4628bba5d3ef124fbaad479bbeeed8049e83fe262c682e21b2a048c85118c3
sources_digest: 685b1c2699e21dd16b49c0068147de356cf4bbf3adc7cb6e6d32f035662b122d
links:
  - to: user-authentication-session-management
    relation: part_of
    description: >-
      useLoginPopupListener establishes BroadcastChannel listener;
      logoutUserThunk broadcasts logout via broadcastLogout
  - to: user-profile-settings-panel
    relation: produces
    description: >-
      Data sync on auth transitions populates workspace and vessel group
      selectors consumed by User.tsx
generator:
  version: 1
covers:
  - symbol: LogoutButton
    kind: function
    at: 'apps/platform/features/_user/LogoutButton.tsx:L20-L74'
  - symbol: getIsLoginPopup
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L46-L53'
  - symbol: usePopupLogin
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L55-L84'
  - symbol: useSettingsMessageListener
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L86-L109'
  - symbol: handleMessage
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L94-L105'
  - symbol: useLoginPopupListener
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L111-L189'
  - symbol: listener
    kind: function
    at: 'apps/platform/features/_user/user.hooks.ts:L182-L182'
  - symbol: UserSettings
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L16-L18'
  - symbol: UserState
    kind: interface
    at: 'apps/platform/features/_user/user.slice.ts:L20-L27'
---

<!-- context:generated:start -->

## Summary

Cross-tab synchronization via BroadcastChannel (auth-channel module) broadcasts login/logout events and triggers fetchVesselInfoThunk and useFetchWorkspace to refresh user-scoped workspace and vessel data. TAB_ID filtering prevents redundant self-broadcasts. Logout defers workspace cleanup to workspace.slice extraReducers to avoid circular dependencies and bundling deck.gl code on every page.

## Related

- part of [[user-authentication-session-management]] — useLoginPopupListener establishes BroadcastChannel listener; logoutUserThunk broadcasts logout via broadcastLogout
- produces [[user-profile-settings-panel]] — Data sync on auth transitions populates workspace and vessel group selectors consumed by User.tsx

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
