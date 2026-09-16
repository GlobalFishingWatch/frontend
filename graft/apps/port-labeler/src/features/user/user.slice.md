# apps/port-labeler/src/features/user/user.slice.ts · [[authentication-api-token-management]] [[user-authentication-permissions]]

Redux slice managing user authentication state, login/logout flows, and user data selectors.

- UserState · interface · L14-L18 — Interface defining the structure of the user state object with login status, async operation status, and user data.
- selectUserData · function · L85-L85 — Selector extracting the user data object from the Redux store state.
- selectUserStatus · function · L86-L86 — Selector extracting the async operation status of the user state from Redux.
- selectUserLogged · function · L87-L87 — Selector extracting the logged-in flag from the user state.
- selectIsGFWUser · function · L88-L89 — Selector determining whether the current user belongs to the GFW Staff group.
