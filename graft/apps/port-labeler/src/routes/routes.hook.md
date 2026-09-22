# apps/port-labeler/src/routes/routes.hook.ts · [[login-authentication-routes]] [[url-routing-query-parameter-synchronization]]

Defines React hooks for managing route navigation and query parameter synchronization in the port labeler application.

- useReplaceLoginUrl · function · L19-L50 — Intercepts post-login redirect by extracting workspace and access token from the callback URL and replacing the current query parameters to clean up temporary login storage.
- useLocationConnect · function · L52-L65 — Provides a dispatch function to update route location with new query parameters while preserving the current payload.
