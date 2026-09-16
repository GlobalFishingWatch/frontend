# apps/platform/server-functions/auth.functions.ts · [[server-authentication-token-management]] [[token-refresh-deduplication]]

Server-side authentication functions module that manages token exchange, token refresh with deduplication, cookie persistence, and logout operations for a TanStack-based application.

- Tokens · type · L12-L12 — Type representing authentication token pair with access token and refresh token.
- CookieSetter · type · L13-L13 — Function type for setting cookies with key, value, and optional configuration.
- setAuthCookies · function · L26-L29 — Persists authentication tokens (access and refresh) as secure HTTP cookies.
- clearAuthCookies · function · L31-L34 — Invalidates authentication cookies by setting their max age to zero.
- refreshAuthTokens · function · L56-L82 — Reloads expired tokens from a refresh token and deduplicates concurrent refresh requests within a time window.
