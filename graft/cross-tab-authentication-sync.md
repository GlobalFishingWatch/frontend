---
name: Cross-Tab Authentication Sync
slug: cross-tab-authentication-sync
type: system
sources:
  - path: apps/platform/features/_user/auth-channel.ts
    hash: 3008fd213662c8869d34a9c34bc8c579145122941b7f2296328d5613b68dd2eb
sources_digest: 6c20451163333b39aa405159b4903540faaad21f5a50b63afc60ff12a1171451
links:
  - to: authentication-and-access-control
    relation: implements
    description: >-
      Provides infrastructure for coordinating login/logout across tabs without
      page reload, enabling seamless multi-tab session management
generator:
  version: 1
covers:
  - symbol: openAuthPopup
    kind: function
    at: 'apps/platform/features/_user/auth-channel.ts:L17-L36'
  - symbol: AuthChannelMessage
    kind: type
    at: 'apps/platform/features/_user/auth-channel.ts:L38-L39'
  - symbol: postAuthMessage
    kind: function
    at: 'apps/platform/features/_user/auth-channel.ts:L41-L46'
  - symbol: broadcastLogin
    kind: function
    at: 'apps/platform/features/_user/auth-channel.ts:L48-L50'
  - symbol: broadcastLogout
    kind: function
    at: 'apps/platform/features/_user/auth-channel.ts:L52-L54'
---

<!-- context:generated:start -->

## Summary

Synchronizes authentication state across browser tabs using BroadcastChannel API with graceful degradation. Exports constants for channel name and message types (LOGIN, LOGOUT, SETTINGS_UPDATED, SESSION_ENDED), unique TAB_ID to prevent self-echoes, and utility functions openAuthPopup (centered 500×750px window), broadcastLogin, and broadcastLogout. Tracks opened popups in a Set and closes all on page unload.

## Related

- implements [[authentication-and-access-control]] — Provides infrastructure for coordinating login/logout across tabs without page reload, enabling seamless multi-tab session management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
