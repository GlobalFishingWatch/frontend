---
name: User Groups Authentication
slug: user-groups-authentication
type: system
sources:
  - path: apps/user-groups-admin/src/components/header/header.tsx
    hash: 6d57611a3f3501e3935a3a1c976f81c2b0df354ce9501d53a02f835ed7703995
  - path: apps/user-groups-admin/src/components/layout/Layout.tsx
    hash: a686f3d6ca83f97141412c15d57811f12e342b2dfa8b04b133444a0752dff4f5
sources_digest: 33404a4612a4ea073297e7cb149fa260fbd52f657fa30e4ef6ff2285f7396f3b
links:
  - to: global-fishing-watch-api-client
    relation: uses
    description: >-
      Layout component calls GFWAPI.logout and uses getLoginUrl/redirectToLogin
      utilities from @globalfishingwatch/react-hooks
  - to: user-groups-administration-system
    relation: configures
    description: >-
      Authentication state gates visibility of the admin interface; user data
      passed to List and Detail components
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Provides OAuth login/logout flows and session management for the user-groups-admin application via useGFWLogin hook and GFWAPI client. Redirects unauthenticated users to login; passes authenticated user data to child components.

## Related

- uses [[global-fishing-watch-api-client]] — Layout component calls GFWAPI.logout and uses getLoginUrl/redirectToLogin utilities from @globalfishingwatch/react-hooks
- configures [[user-groups-administration-system]] — Authentication state gates visibility of the admin interface; user data passed to List and Detail components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
