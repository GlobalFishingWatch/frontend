# apps/platform/server-functions/user.functions.ts · [[server-authentication-token-management]] [[user-state-resolution]]

Server module that resolves user authentication state from HTTP request cookies and tokens.

- resolveUserStateFromRequest · function · L11-L43 — Resolves the authenticated user from request cookies by attempting access token validation, then refresh token exchange, falling back to guest user on all auth failures.
