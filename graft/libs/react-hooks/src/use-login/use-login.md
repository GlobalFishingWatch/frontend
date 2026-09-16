# libs/react-hooks/src/use-login/use-login.ts · [[react-hooks-authentication-flow]] [[react-hooks-defensive-patterns]] [[react-hooks-library]] [[react-hooks-standard-library-dependencies]]

React hooks module for managing Global Fishing Watch login state, authentication, and logout functionality.

- GFWLoginHook · interface · L10-L15 — Interface defining the shape of login state including logged-in status, loading state, user data, and error information.
- useGFWLoginRedirect · function · L17-L21 — Hook that redirects unauthenticated users to the login page when login fails.
- useGFWLogin · function · L23-L50 — Hook that initializes user authentication by extracting access tokens from the URL and logging in via the API client, managing login state and errors.
- logoutUser · function · L52-L55 — Async function that logs out the user and redirects to the login page.
