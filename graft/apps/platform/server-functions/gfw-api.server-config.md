# apps/platform/server-functions/gfw-api.server-config.ts · [[async-local-request-context-pattern]] [[server-authentication-token-management]]

- Tokens · type · L11-L11 — Type representing an authentication token pair comprising an access token and refresh token.
- AuthTokenHolder · type · L12-L12 — Type representing the async-local storage container for a token and an optional in-flight refresh promise.
- runRequestWithAuthToken · function · L15-L19 — Executes a callback function within an async-local storage context that holds the authentication token extracted from a request's cookie header.
- configureServerGFWAPI · function · L26-L74 — Initializes the server-side GFWAPI client with token storage and refresh logic that uses async-local storage and dynamically imports server modules to handle authentication.
