# libs/react-hooks/src/use-login-redirect/use-login-redirect.ts · [[react-hooks-authentication-flow]] [[react-hooks-defensive-patterns]] [[react-hooks-library]]

Module that exports utilities and a React hook for managing login redirects, storing redirect URLs and navigation history in localStorage.

- setRedirectUrl · function · L11-L15 — Stores the current URL to localStorage to enable returning to it after login completion.
- setHistoryNavigation · function · L17-L24 — Persists navigation history as a JSON string to localStorage for later restoration.
- getHistoryNavigation · function · L26-L34 — Retrieves and deserializes stored navigation history from localStorage, defaulting to an empty array if none exists.
- getLoginUrl · function · L36-L49 — Constructs the authentication login URL with callback parameters and custom query parameters.
- redirectToLogin · function · L51-L62 — Orchestrates the complete login redirect flow by saving state and navigating to the login URL.
- useLoginRedirect · function · L64-L112 — Custom React hook providing login redirect functionality with state management and callbacks for saving/clearing redirect and navigation data.
