---
name: Test Infrastructure and Utilities
slug: test-infrastructure-and-utilities
type: system
sources:
  - path: apps/platform/test/appTestUtils.tsx
    hash: 0d95d195c5540c3db5d1a9e42fa0b538ba7e8f529a49876ca5f51d476cb083a2
  - path: apps/platform/test/setup/config.ts
    hash: 3e59d1071ed5b41982cd0529b50dc51a5f690bb3d60796a23ae0e1180c5d9e8e
  - path: apps/platform/test/setup/login/auth-setup.ts
    hash: c4c82095530939112c0ff9afd1d65c0e0b5179ba1f22f70b83511f7888568873
  - path: apps/platform/test/setup/login/proxy-server.ts
    hash: 4a2a1d74cdda6b9f101d7e622986723d4cbfe961c14aaa656bf449d6d47d919d
  - path: apps/platform/test/setup/logs.ts
    hash: 0c7e0ec8f038d0e52b407a2ac34752491d35dd8225c2a559f29e3cc583070c5c
  - path: apps/platform/test/setup/vitest.setup-global.ts
    hash: e30eb2e5d476fd96b7c41ab50cc18808666509f8391f3a1e9edbdcda0421be45
  - path: apps/platform/test/setup/vitest.setup.ts
    hash: e7ef33d08af695c763473eeec5b558aa743568d1baf49f965f1f152ce88fd39d
  - path: apps/platform/test/utils/fixtures.ts
    hash: f2e3480962306f4a41e327b50d86099abf1fae416386912ef456a2d55dfc9072
  - path: apps/platform/test/utils/help-hub.ts
    hash: f36016b6d5d5edd886d0cc9660a030ecfa484a3576f7761887f90bcf708287cb
sources_digest: 1ea3ed69d202f5c0d6a23dab98ee8e9e394d36a8500d33c15cdc457d9ac5fedf
links:
  - to: redux-store-configuration
    relation: uses
    description: appTestUtils.render() creates store via makeStore for test execution
  - to: server-side-internationalization-i18n
    relation: depends_on
    description: Test setup initializes i18n with English language via vitest.setup.ts
generator:
  version: 1
covers:
  - symbol: AppRenderOptions
    kind: interface
    at: 'apps/platform/test/appTestUtils.tsx:L24-L28'
  - symbol: buildInitialHref
    kind: function
    at: 'apps/platform/test/appTestUtils.tsx:L30-L37'
  - symbol: seedBrowserHistory
    kind: function
    at: 'apps/platform/test/appTestUtils.tsx:L39-L42'
  - symbol: withGuestUser
    kind: function
    at: 'apps/platform/test/appTestUtils.tsx:L44-L47'
  - symbol: render
    kind: function
    at: 'apps/platform/test/appTestUtils.tsx:L49-L111'
  - symbol: Wrapper
    kind: function
    at: 'apps/platform/test/appTestUtils.tsx:L99-L101'
  - symbol: hasValidTokens
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L25-L59'
  - symbol: rejectAfter
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L61-L63'
  - symbol: logBanner
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L65-L69'
  - symbol: setupPageLogging
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L71-L78'
  - symbol: getAuthErrorMessage
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L80-L89'
  - symbol: runLoginFlow
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L91-L170'
  - symbol: AuthSetupOptions
    kind: type
    at: 'apps/platform/test/setup/login/auth-setup.ts:L172-L174'
  - symbol: runAuthSetup
    kind: function
    at: 'apps/platform/test/setup/login/auth-setup.ts:L176-L212'
  - symbol: startAuthProxyServer
    kind: function
    at: 'apps/platform/test/setup/login/proxy-server.ts:L9-L47'
  - symbol: closeLogStream
    kind: function
    at: 'apps/platform/test/setup/logs.ts:L5-L10'
  - symbol: initLogStream
    kind: function
    at: 'apps/platform/test/setup/logs.ts:L12-L15'
  - symbol: log
    kind: function
    at: 'apps/platform/test/setup/logs.ts:L17-L23'
  - symbol: globalSetup
    kind: function
    at: 'apps/platform/test/setup/vitest.setup-global.ts:L7-L12'
  - symbol: filler
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L26-L30'
  - symbol: strapiBase
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L32-L40'
  - symbol: thumbnail
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L42-L47'
  - symbol: landingSection
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L137-L141'
  - symbol: tocRow
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L144-L148'
  - symbol: tocRowButtons
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L150-L152'
  - symbol: tocRowTitles
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L154-L158'
  - symbol: activeTocTitle
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L160-L162'
  - symbol: highlightedTexts
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L164-L168'
  - symbol: imagesWithSrc
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L170-L172'
  - symbol: spinners
    kind: function
    at: 'apps/platform/test/utils/help-hub.ts:L174-L176'
---

<!-- context:generated:start -->

## Summary

Provides core testing utilities including appTestUtils.render() wrapper that sets up TanStack Router, Jotai, and Redux stores with optional auth setup; test middleware for action interception; fixtures for datasets and CMS content; and global setup hooks for authentication, logging, and environment initialization.

## Related

- uses [[redux-store-configuration]] — appTestUtils.render() creates store via makeStore for test execution
- depends on [[server-side-internationalization-i18n]] — Test setup initializes i18n with English language via vitest.setup.ts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
