---
name: Authentication state machine and permission gating
slug: authentication-state-machine-and-permission-gating
type: concept
sources:
  - path: apps/data-download-portal/src/routes/__root.tsx
    hash: 5e8e7dc003d4682eba8fd7ac90415ec2536bdffea6f8ef69cd843c81ea5a44f0
  - path: apps/image-labeler/src/features/projects-list/ProjectsList.tsx
    hash: cb14b40288e27105cd3a8df8b807472d3480dd80c46d528b4a26e2728187cc97
  - path: apps/image-labeler/src/routes/__root.tsx
    hash: bbbe30c064a577d4658708d7910f2152ab89bc2365804b6722fdcf82991c67fc
  - path: apps/platform-e2e/src/pages/LoginPage.ts
    hash: b7165da33697409af59cb0aeaa585d63b3e59c34f5f46376d50d4642410734ec
sources_digest: c36d755a37b86b131dc490c37233d724a369a34893ba25a3cd4725cfc92b9a2d
links: []
generator:
  version: 1
covers:
  - symbol: RootComponent
    kind: function
    at: 'apps/data-download-portal/src/routes/__root.tsx:L13-L35'
  - symbol: ProjectsList
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectsList.tsx:L23-L56'
  - symbol: closeModal
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectsList.tsx:L32-L34'
  - symbol: RootComponent
    kind: function
    at: 'apps/image-labeler/src/routes/__root.tsx:L17-L54'
  - symbol: requireEnv
    kind: function
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L14-L20'
  - symbol: LoginPage
    kind: class
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L22-L225'
  - symbol: constructor
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L34-L42'
  - symbol: openLoginPopup
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L44-L55'
  - symbol: login
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L57-L66'
  - symbol: loginWithPopupsBlocked
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L68-L85'
  - symbol: loginExpectingFailure
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L88-L98'
  - symbol: cancelLogin
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L101-L104'
  - symbol: newTab
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L106-L112'
  - symbol: openUserPanel
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L114-L117'
  - symbol: logout
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L119-L126'
  - symbol: openSettingsPopup
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L128-L134'
  - symbol: getSettingsUrl
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L136-L141'
  - symbol: emitGatewaySessionEnded
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L143-L151'
  - symbol: expectSettingsRequiresLogin
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L153-L159'
  - symbol: reload
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L161-L163'
  - symbol: close
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L165-L167'
  - symbol: clearUserToken
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L169-L171'
  - symbol: clearRefreshToken
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L173-L175'
  - symbol: clearCookies
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L177-L179'
  - symbol: getCookie
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L181-L184'
  - symbol: expectLoggedIn
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L186-L188'
  - symbol: expectUserVisible
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L190-L193'
  - symbol: expectGuest
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L195-L197'
  - symbol: expectAppReady
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L199-L201'
  - symbol: expectUserTokenCleared
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L203-L205'
  - symbol: expectUserTokenPresent
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L206-L208'
  - symbol: expectRefreshTokenPresent
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L210-L212'
  - symbol: expectRefreshTokenCleared
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L214-L216'
  - symbol: expectGatewaySessionPresent
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L218-L220'
  - symbol: expectGatewaySessionCleared
    kind: method
    at: 'apps/platform-e2e/src/pages/LoginPage.ts:L222-L224'
---

<!-- context:generated:start -->

## Summary

Cross-app pattern for auth-aware UI rendering with three distinct states: loading (Spinner), unauthorized (error message with logout button), and authenticated (functional UI). Implemented via useGFWLogin hook providing isLoading and userData, useGFWLoginRedirect for auto-redirect, and checkExistPermissionInList for permission validation. Image Labeler gates the entire app at __root.tsx with labelling-project permission check; data-download-portal has deferred/incomplete enforcement (commented-out login redirect). Logout flow reloads window to clear session; platform E2E tests manage authentication via cookie injection and popup flows.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
