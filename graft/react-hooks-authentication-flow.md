---
name: React Hooks Authentication Flow
slug: react-hooks-authentication-flow
type: concept
sources:
  - path: libs/react-hooks/src/use-login-redirect/use-login-redirect.ts
    hash: 5bd1620524629cfaa8052275cef20396cd75dd753024e812ebe9c687bdcf7160
  - path: libs/react-hooks/src/use-login/index.ts
    hash: 077cb8091ca9d59105b8803ceab71bb34be3f98959cb8e193f4175cbc2a29633
  - path: libs/react-hooks/src/use-login/Login.tsx
    hash: 58b27834135c612bf27061c56ec4c1255b5119e641e4b050da931ac71f2644ea
  - path: libs/react-hooks/src/use-login/use-login.ts
    hash: 50c78dacc62f0472eb6a846f2a7035b9829e656c9aa7ea401afced90f769a47c
sources_digest: 4384a444ebed255c9dcaf0735dfbfd9793e0bdccb29f675a9af24c1109167524
links: []
generator:
  version: 1
covers:
  - symbol: setRedirectUrl
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L11-L15'
  - symbol: setHistoryNavigation
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L17-L24'
  - symbol: getHistoryNavigation
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L26-L34'
  - symbol: getLoginUrl
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L36-L49'
  - symbol: redirectToLogin
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L51-L62'
  - symbol: useLoginRedirect
    kind: function
    at: 'libs/react-hooks/src/use-login-redirect/use-login-redirect.ts:L64-L112'
  - symbol: Login
    kind: function
    at: 'libs/react-hooks/src/use-login/Login.tsx:L3-L8'
  - symbol: GFWLoginHook
    kind: interface
    at: 'libs/react-hooks/src/use-login/use-login.ts:L10-L15'
  - symbol: useGFWLoginRedirect
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L17-L21'
  - symbol: useGFWLogin
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L23-L50'
  - symbol: logoutUser
    kind: function
    at: 'libs/react-hooks/src/use-login/use-login.ts:L52-L55'
---

<!-- context:generated:start -->

## Summary

Stateful auth pattern managing login flow, token extraction from URL, session state, and redirect coordination. useGFWLogin initializes auth by calling GFWAPI.login() and managing user/error state; useGFWLoginRedirect auto-redirects unauthenticated users to login URL; useLoginRedirect persists current URL and navigation history before login; Login component guards content behind logged-in status. Design removes token from URL after login to prevent reuse.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
