---
name: User Authentication & Session Management
slug: user-authentication-session-management
type: system
sources:
  - path: apps/platform/features/_user/LoginPopupHandler.tsx
    hash: d0a31b015999d5937e14275026dc8cf86217edce0437be7bfea114bb5b7b653a
  - path: apps/platform/features/_user/LogoutButton.tsx
    hash: e2a2048c27292fe9eaa5ad272f451a7e4e1f709348dadaf310ac02808f6f3142
  - path: apps/platform/features/_user/user-expired.hooks.tsx
    hash: f60138bb4ec12adb7939f316cd8cc4e5d7d6c73074e8f9c6825aacf901595b9e
  - path: apps/platform/features/_user/user.hooks.ts
    hash: 983348a5e5e94012f09e707c52be932c5e2273a05249728b5eebac23f5b3f3cb
  - path: apps/platform/features/_user/user.slice.ts
    hash: dc4628bba5d3ef124fbaad479bbeeed8049e83fe262c682e21b2a048c85118c3
sources_digest: 3ffd745872aaf769da39b106896c2804f9f3ea6efe5809f54878a38359fb0ee9
links:
  - to: login-ui-components
    relation: produces
    description: >-
      Sets loginSource and dispatches login/logout actions that are consumed by
      LoginLink and LoginButtonWrapper to render auth-gated features
  - to: user-authorization-permissions-system
    relation: depends_on
    description: >-
      Queries selectIsGuestUser, selectIsGFWUser, and other permission selectors
      to determine access levels and render appropriate auth UIs
  - to: workspace-vessel-data-sync
    relation: depends_on
    description: >-
      Triggers fetchVesselInfoThunk and useFetchWorkspace hooks on login via
      BroadcastChannel listener to refresh user-scoped workspace and vessel data
generator:
  version: 1
covers:
  - symbol: LoginPopupHandler
    kind: function
    at: 'apps/platform/features/_user/LoginPopupHandler.tsx:L15-L42'
  - symbol: LogoutButton
    kind: function
    at: 'apps/platform/features/_user/LogoutButton.tsx:L20-L74'
  - symbol: useUserExpiredToast
    kind: function
    at: 'apps/platform/features/_user/user-expired.hooks.tsx:L12-L40'
  - symbol: ToastContent
    kind: function
    at: 'apps/platform/features/_user/user-expired.hooks.tsx:L16-L26'
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

Manages user login, logout, session expiration, and cross-tab synchronization via OAuth popups and BroadcastChannel. Coordinates Redux state (user.slice), API interaction (GFWAPI), and toast notifications, handling guest detection, login sources, and workspace/vessel data refresh on auth transitions.

## Related

- produces [[login-ui-components]] — Sets loginSource and dispatches login/logout actions that are consumed by LoginLink and LoginButtonWrapper to render auth-gated features
- depends on [[user-authorization-permissions-system]] — Queries selectIsGuestUser, selectIsGFWUser, and other permission selectors to determine access levels and render appropriate auth UIs
- depends on [[workspace-vessel-data-sync]] — Triggers fetchVesselInfoThunk and useFetchWorkspace hooks on login via BroadcastChannel listener to refresh user-scoped workspace and vessel data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
