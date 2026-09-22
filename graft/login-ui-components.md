---
name: Login UI Components
slug: login-ui-components
type: system
sources:
  - path: apps/platform/features/_user/LoginButtonWrapper.tsx
    hash: 481097c70ef76d53f4728fb685484261aa3aad7dc8477656cf527a33b0f74086
  - path: apps/platform/features/_user/LoginLink.tsx
    hash: f8cb63c2838633f05832b8c0f38794c263ac3652a06f168846f6b37e74b80b5a
  - path: apps/platform/features/_user/SettingsButton.tsx
    hash: cbc7858d44f59ec9a724e587ffb4f77b1a28c6f0b943233c46d3b254726be601
  - path: apps/platform/features/_user/UserButton.tsx
    hash: 5d40578a4e7e94982b6d7c5d3c490e3b295a74a627fbb836187d2670924f9daf
  - path: apps/platform/features/_user/UserLoggedIconButton.tsx
    hash: 2835b0d2518b5a205c73ce1482414cb3341f37f902406ddd452188fad849c2c4
sources_digest: cbfd15c77bd4991801cde0802173752462f41158114aff9c4c0475a5cd5a9fac
links:
  - to: user-authentication-session-management
    relation: uses
    description: >-
      Dispatches setLoginSource, invokes usePopupLogin, and tracks analytics via
      trackEvent on LoginLink click
  - to: user-authorization-permissions-system
    relation: depends_on
    description: >-
      Consumes selectIsGuestUser, selectIsUserExpired to conditionally render
      login triggers vs. authenticated UI
  - to: user-profile-settings-panel
    relation: depends_on
    description: >-
      UserButton navigates to user profile on click; SettingsButton delegates to
      GFWAPI settings URL; both depend on selectUserData for display
generator:
  version: 1
covers:
  - symbol: LoginButtonWrapperProps
    kind: interface
    at: 'apps/platform/features/_user/LoginButtonWrapper.tsx:L15-L20'
  - symbol: LoginButtonWrapper
    kind: function
    at: 'apps/platform/features/_user/LoginButtonWrapper.tsx:L22-L51'
  - symbol: LoginLinkProps
    kind: type
    at: 'apps/platform/features/_user/LoginLink.tsx:L12-L18'
  - symbol: LoginLink
    kind: function
    at: 'apps/platform/features/_user/LoginLink.tsx:L20-L55'
  - symbol: useRedirectToSettingsPage
    kind: function
    at: 'apps/platform/features/_user/SettingsButton.tsx:L9-L19'
  - symbol: SettingsButton
    kind: function
    at: 'apps/platform/features/_user/SettingsButton.tsx:L21-L31'
  - symbol: UserButton
    kind: function
    at: 'apps/platform/features/_user/UserButton.tsx:L25-L120'
  - symbol: UserLoggedIconButton
    kind: type
    at: 'apps/platform/features/_user/UserLoggedIconButton.tsx:L15-L23'
  - symbol: UserLoggedIconButton
    kind: function
    at: 'apps/platform/features/_user/UserLoggedIconButton.tsx:L25-L57'
---

<!-- context:generated:start -->

## Summary

Renders authentication-gated UI elements that redirect unauthenticated users to login. Includes LoginLink (click-handler with analytics), LoginButtonWrapper (HOC that clones buttons and applies tooltip), UserButton (sidebar profile link), UserLoggedIconButton (conditional icon wrapper), and SettingsButton. Integrates with user.slice's setLoginSource and usePopupLogin for SSO.

## Related

- uses [[user-authentication-session-management]] — Dispatches setLoginSource, invokes usePopupLogin, and tracks analytics via trackEvent on LoginLink click
- depends on [[user-authorization-permissions-system]] — Consumes selectIsGuestUser, selectIsUserExpired to conditionally render login triggers vs. authenticated UI
- depends on [[user-profile-settings-panel]] — UserButton navigates to user profile on click; SettingsButton delegates to GFWAPI settings URL; both depend on selectUserData for display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
