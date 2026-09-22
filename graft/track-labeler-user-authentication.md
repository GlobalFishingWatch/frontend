---
name: Track Labeler User Authentication
slug: track-labeler-user-authentication
type: system
sources:
  - path: apps/track-labeler/src/features/user/user.actions.ts
    hash: 5adc3c84e6e3e27c736111c9ba8ebe7185abc1e56d03b60e495df01647e82d79
  - path: apps/track-labeler/src/features/user/user.hooks.ts
    hash: bef358541b54f4c4195721ed5920b4f311004a41e7ad741066e1807a3b06225e
  - path: apps/track-labeler/src/features/user/user.slice.ts
    hash: c47c0013ea51b6456506fd08d8334af96e4936087e6543714760a81d3db00ddb
  - path: apps/track-labeler/src/features/user/user.thunks.ts
    hash: 026d390af32619bb76df9e3ed7399bfd2efa67f5423c5c29dbc360de95a54c18
sources_digest: 44f70b27a8b093855f120ce1a711fc62574ac894e36248bc57548de542da51b4
links:
  - to: global-fishing-watch-api-client
    relation: uses
    description: >-
      User slice calls GFWAPI.login and token utility functions; thunks trigger
      GFWAPI authentication
  - to: track-labeler-routing
    relation: depends_on
    description: >-
      User slice dispatches redirects to LOGIN/HOME routes via
      redux-first-router; routing middlewares check token expiration before
      navigation
  - to: track-labeler-vessel-metadata
    relation: configures
    description: >-
      User hooks filter project access and combine user permissions with project
      authorization; controls whether users can fetch vessel data
generator:
  version: 1
covers:
  - symbol: UserHookType
    kind: interface
    at: 'apps/track-labeler/src/features/user/user.hooks.ts:L14-L20'
  - symbol: useUser
    kind: function
    at: 'apps/track-labeler/src/features/user/user.hooks.ts:L22-L49'
  - symbol: UserState
    kind: interface
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L13-L20'
  - symbol: UserToken
    kind: interface
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L31-L37'
  - symbol: fetchUser
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L77-L95'
  - symbol: selectUserData
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L100-L100'
  - symbol: selectUserResolved
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L101-L101'
  - symbol: selectUserLogged
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L102-L102'
  - symbol: selectUserLoading
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L103-L103'
  - symbol: selectUserTokenExpirationTimestamp
    kind: function
    at: 'apps/track-labeler/src/features/user/user.slice.ts:L104-L105'
  - symbol: userLoginThunk
    kind: function
    at: 'apps/track-labeler/src/features/user/user.thunks.ts:L12-L32'
  - symbol: checkUserLoggedThunk
    kind: function
    at: 'apps/track-labeler/src/features/user/user.thunks.ts:L34-L38'
---

<!-- context:generated:start -->

## Summary

Manages user login, token expiration, and session lifecycle in the track-labeler app via Redux. Handles JWT decoding, 401 error recovery, and coordinates between login URL callbacks and global API client state.

## Related

- uses [[global-fishing-watch-api-client]] — User slice calls GFWAPI.login and token utility functions; thunks trigger GFWAPI authentication
- depends on [[track-labeler-routing]] — User slice dispatches redirects to LOGIN/HOME routes via redux-first-router; routing middlewares check token expiration before navigation
- configures [[track-labeler-vessel-metadata]] — User hooks filter project access and combine user permissions with project authorization; controls whether users can fetch vessel data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
