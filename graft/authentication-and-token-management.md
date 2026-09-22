---
name: Authentication and Token Management
slug: authentication-and-token-management
type: system
sources:
  - path: apps/platform/test/setup/login/auth-setup.ts
    hash: c4c82095530939112c0ff9afd1d65c0e0b5179ba1f22f70b83511f7888568873
  - path: apps/platform/test/setup/login/proxy-server.ts
    hash: 4a2a1d74cdda6b9f101d7e622986723d4cbfe961c14aaa656bf449d6d47d919d
  - path: apps/platform/test/setup/logs.ts
    hash: 0c7e0ec8f038d0e52b407a2ac34752491d35dd8225c2a559f29e3cc583070c5c
sources_digest: f2b6512c3d05aa2812641230515a581c9c991a5bf4d9e295583bebcebe20da8a
links:
  - to: test-infrastructure-and-utilities
    relation: part_of
    description: Integrated into vitest.setup-global.ts as validateAuthSetup hook
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Provides E2E test authentication via Playwright-driven OAuth flow through a local proxy server (port 3000) that intercepts GFWAPI callbacks and extracts access tokens. Validates cached tokens via /auth/me endpoint and exchanges them for persistent API tokens. Logs authentication events to AUTH_LOG_FILE with streaming I/O.

## Related

- part of [[test-infrastructure-and-utilities]] — Integrated into vitest.setup-global.ts as validateAuthSetup hook

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
