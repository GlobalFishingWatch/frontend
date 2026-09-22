---
name: Playwright E2E cross-tab communication and hydration testing
slug: playwright-e2e-cross-tab-communication-and-hydration-testing
type: concept
sources:
  - path: apps/platform-e2e/src/fixtures.ts
    hash: 94cd0a13d401d50bb4da9d3700d724270f8741a6cfb1f643f1c103a97d2b7cc4
  - path: apps/platform-e2e/src/helpers/hydration.ts
    hash: 8ae5515b000847d6435b968c92890b64d360817fe17a795e6832fd101f926382
  - path: apps/platform-e2e/src/pages/LoginPage.ts
    hash: b7165da33697409af59cb0aeaa585d63b3e59c34f5f46376d50d4642410734ec
sources_digest: 5aba748e72883e97b886da6f4ae07253bce4ceb3a6f8d12d4a20c0c92560aff3
links: []
generator:
  version: 1
covers:
  - symbol: waitForHydration
    kind: function
    at: 'apps/platform-e2e/src/helpers/hydration.ts:L11-L25'
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

Platform E2E suite addresses asynchronous testing challenges specific to distributed state and React SSR. waitForHydration polls for React fiber metadata (__reactFiber$ or __reactProps$) keys on sidebar container, which React only adds after successful client hydration—essential for BroadcastChannel listener registration that occurs in hydration effects. Message buffering doesn't occur, so timing between tabs is critical. newTab() method on LoginPage creates new browser tab sharing the same context, enabling multi-tab broadcast scenarios. loginWithPopupsBlocked() stubs window.open for inline auth testing without popup infrastructure. These patterns work around framework and browser timing quirks that would cause flaky tests.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
