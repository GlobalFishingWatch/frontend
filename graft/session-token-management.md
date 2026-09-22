---
name: Session Token Management
slug: session-token-management
type: concept
sources:
  - path: libs/api-client/src/api-client.ts
    hash: 7f3670ccf40cbb865211fed72b07213ac8435787bfdce00e3d84fa76ece61d99
  - path: libs/api-client/src/config.ts
    hash: 2f2f172043754b5f3585a5489103772d50351c66f8e8e98a23ebb8e77ab82917
sources_digest: 12e7b25e170cedc2cfc7bac46ab62238d77675ca5914606402d3aa0ebb843e08
links:
  - to: global-fishing-watch-api-client
    relation: part_of
    description: >-
      API client manages token storage, refresh retry logic, and cross-tab
      coordination
  - to: track-labeler-user-authentication
    relation: implements
    description: >-
      User slice accesses token utilities from API client to decode JWT and
      check expiration
generator:
  version: 1
covers:
  - symbol: UserTokens
    kind: interface
    at: 'libs/api-client/src/api-client.ts:L37-L40'
  - symbol: LoginParams
    kind: interface
    at: 'libs/api-client/src/api-client.ts:L42-L45'
  - symbol: ApiVersion
    kind: type
    at: 'libs/api-client/src/api-client.ts:L46-L46'
  - symbol: FetchOptions
    kind: type
    at: 'libs/api-client/src/api-client.ts:L47-L58'
  - symbol: InternalFetchOptions
    kind: type
    at: 'libs/api-client/src/api-client.ts:L60-L65'
  - symbol: RefreshStrategy
    kind: type
    at: 'libs/api-client/src/api-client.ts:L67-L67'
  - symbol: SessionInvalidateStrategy
    kind: type
    at: 'libs/api-client/src/api-client.ts:L68-L68'
  - symbol: RequestStatus
    kind: type
    at: 'libs/api-client/src/api-client.ts:L70-L70'
  - symbol: GFW_API_CLASS
    kind: class
    at: 'libs/api-client/src/api-client.ts:L71-L811'
  - symbol: constructor
    kind: method
    at: 'libs/api-client/src/api-client.ts:L90-L111'
  - symbol: debugLog
    kind: method
    at: 'libs/api-client/src/api-client.ts:L113-L117'
  - symbol: debugWarn
    kind: method
    at: 'libs/api-client/src/api-client.ts:L119-L123'
  - symbol: debugAuthState
    kind: method
    at: 'libs/api-client/src/api-client.ts:L125-L136'
  - symbol: configure
    kind: method
    at: 'libs/api-client/src/api-client.ts:L138-L180'
  - symbol: invalidateClientSession
    kind: method
    at: 'libs/api-client/src/api-client.ts:L182-L189'
  - symbol: token
    kind: method
    at: 'libs/api-client/src/api-client.ts:L191-L193'
  - symbol: token
    kind: method
    at: 'libs/api-client/src/api-client.ts:L195-L200'
  - symbol: refreshToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L202-L207'
  - symbol: refreshToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L209-L216'
  - symbol: getStoredLocale
    kind: method
    at: 'libs/api-client/src/api-client.ts:L218-L220'
  - symbol: getRegisterUrl
    kind: method
    at: 'libs/api-client/src/api-client.ts:L222-L230'
  - symbol: getLoginUrl
    kind: method
    at: 'libs/api-client/src/api-client.ts:L232-L247'
  - symbol: getSettingsUrl
    kind: method
    at: 'libs/api-client/src/api-client.ts:L249-L264'
  - symbol: getLogoutSessionUrl
    kind: method
    at: 'libs/api-client/src/api-client.ts:L266-L280'
  - symbol: getConfig
    kind: method
    at: 'libs/api-client/src/api-client.ts:L282-L290'
  - symbol: exchangeAccessToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L292-L304'
  - symbol: reloadTokens
    kind: method
    at: 'libs/api-client/src/api-client.ts:L306-L315'
  - symbol: revokeRefreshToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L317-L324'
  - symbol: reloadAPIToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L326-L342'
  - symbol: withTokenRefreshLock
    kind: method
    at: 'libs/api-client/src/api-client.ts:L344-L349'
  - symbol: getRotatedRefreshToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L351-L354'
  - symbol: refreshTokens
    kind: method
    at: 'libs/api-client/src/api-client.ts:L356-L376'
  - symbol: refreshAPIToken
    kind: method
    at: 'libs/api-client/src/api-client.ts:L378-L410'
  - symbol: generateUrl
    kind: method
    at: 'libs/api-client/src/api-client.ts:L412-L429'
  - symbol: fetch
    kind: method
    at: 'libs/api-client/src/api-client.ts:L431-L436'
  - symbol: download
    kind: method
    at: 'libs/api-client/src/api-client.ts:L438-L452'
  - symbol: normalizeError
    kind: method
    at: 'libs/api-client/src/api-client.ts:L454-L456'
  - symbol: _internalFetch
    kind: method
    at: 'libs/api-client/src/api-client.ts:L458-L484'
  - symbol: _fetchAttempt
    kind: method
    at: 'libs/api-client/src/api-client.ts:L486-L634'
  - symbol: fetchUser
    kind: method
    at: 'libs/api-client/src/api-client.ts:L636-L656'
  - symbol: fetchGuestUser
    kind: method
    at: 'libs/api-client/src/api-client.ts:L658-L679'
  - symbol: _login
    kind: method
    at: 'libs/api-client/src/api-client.ts:L681-L771'
  - symbol: login
    kind: method
    at: 'libs/api-client/src/api-client.ts:L773-L785'
  - symbol: logout
    kind: method
    at: 'libs/api-client/src/api-client.ts:L787-L810'
---

<!-- context:generated:start -->

## Summary

Tokens are stored in localStorage (or via external RefreshStrategy callbacks) and automatically refreshed on 401 Unauthorized. Token reload is coordinated across tabs via Web Locks API to prevent duplicate refresh requests. Session invalidation clears storage and invokes optional callbacks.

## Related

- part of [[global-fishing-watch-api-client]] — API client manages token storage, refresh retry logic, and cross-tab coordination
- implements [[track-labeler-user-authentication]] — User slice accesses token utilities from API client to decode JWT and check expiration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
