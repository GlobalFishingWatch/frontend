---
name: OAuth Popup Login & Token Handling
slug: oauth-popup-login-token-handling
type: concept
sources:
  - path: apps/platform/features/_user/LoginPopupHandler.tsx
    hash: d0a31b015999d5937e14275026dc8cf86217edce0437be7bfea114bb5b7b653a
  - path: apps/platform/features/_user/user.hooks.ts
    hash: 983348a5e5e94012f09e707c52be932c5e2273a05249728b5eebac23f5b3f3cb
sources_digest: cef27697a17471da2f3eb063979d81de285b1103de8e84b67dedaa523bff90bd
links:
  - to: user-authentication-session-management
    relation: part_of
    description: >-
      OAuth flow is orchestrated by usePopupLogin and LoginPopupHandler as part
      of session establishment
generator:
  version: 1
covers:
  - symbol: LoginPopupHandler
    kind: function
    at: 'apps/platform/features/_user/LoginPopupHandler.tsx:L15-L42'
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
---

<!-- context:generated:start -->

## Summary

usePopupLogin opens GFWAPI OAuth popup or redirects if popup blocking; LoginPopupHandler intercepts OAuth callback in popup window, extracts token via getAccessTokenFromUrl, validates via useRef guard, submits to loginServerFn, broadcasts via broadcastLogin, and closes/redirects based on REDIRECT_KEY parameter. Redirect validation prevents open-redirect by enforcing relative paths (starting '/' but not '//').

## Related

- part of [[user-authentication-session-management]] — OAuth flow is orchestrated by usePopupLogin and LoginPopupHandler as part of session establishment

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
