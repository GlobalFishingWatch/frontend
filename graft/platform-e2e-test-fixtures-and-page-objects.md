---
name: Platform E2E test fixtures and page objects
slug: platform-e2e-test-fixtures-and-page-objects
type: system
sources:
  - path: apps/platform-e2e/src/fixtures.ts
    hash: 94cd0a13d401d50bb4da9d3700d724270f8741a6cfb1f643f1c103a97d2b7cc4
  - path: apps/platform-e2e/src/pages/LoginPage.ts
    hash: b7165da33697409af59cb0aeaa585d63b3e59c34f5f46376d50d4642410734ec
sources_digest: 90253b5095fa24fa66be5ffce02826bec243941ee76138bf6d9b964443d44d32
links:
  - to: platform-e2e-test-helpers
    relation: uses
    description: >-
      LoginPage uses waitForHydration and disableWelcomePopups helpers; fixtures
      uses disableWelcomePopups for auto-fixture
generator:
  version: 1
covers:
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

Playwright test infrastructure for the Global Fishing Watch platform. fixtures.ts exports extended test runner with welcomePopupsDisabled auto-fixture and loginPage fixture providing LoginPage page object. LoginPage encapsulates authentication flows (popup login, direct login with popups blocked), cookie management (USER_TOKEN_COOKIE_KEY, USER_REFRESH_TOKEN_COOKIE_KEY, koa.sess), session detection, and UI state assertions (expectLoggedIn, expectAppReady, openSettingsPopup). Credentials (TEST_USER_EMAIL, TEST_USER_PASSWORD, TEST_USER_NAME) load from environment variables via requireEnv helper. Page object provides methods for multi-tab context sharing via newTab() to test cross-tab broadcast scenarios.

## Related

- uses [[platform-e2e-test-helpers]] — LoginPage uses waitForHydration and disableWelcomePopups helpers; fixtures uses disableWelcomePopups for auto-fixture

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
