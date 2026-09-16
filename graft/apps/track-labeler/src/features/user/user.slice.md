# apps/track-labeler/src/features/user/user.slice.ts · [[track-labeler-user-authentication]]

Redux slice module for managing user authentication state, including login flow, token expiration, and user data retrieval.

- UserState · interface · L13-L20 — Defines the shape of the user state tree containing authentication status, token metadata, loading indicators, and user profile data.
- UserToken · interface · L31-L37 — Defines the structure of a decoded JWT token containing user data and standard claims.
- fetchUser · function · L77-L95 — Asynchronous thunk that authenticates the user by exchanging an access token for user data and redirects to home on success.
- selectUserData · function · L100-L100 — Selector that extracts the user profile data from the Redux state.
- selectUserResolved · function · L101-L101 — Selector that indicates whether the initial user authentication attempt has completed.
- selectUserLogged · function · L102-L102 — Selector that extracts the current login status from the Redux state.
- selectUserLoading · function · L103-L103 — Selector that indicates whether a user authentication request is currently in progress.
- selectUserTokenExpirationTimestamp · function · L104-L105 — Selector that retrieves the expiration timestamp of the user's authentication token.
