# apps/platform/server/api/utils/request.ts · [[security-csrf-mitigation-for-public-apis]]

Utility module providing CSRF protection and error responses for public, guest-accessible API routes that don't require authentication.

- isSameOrigin · function · L14-L24 — Verifies that an incoming request originated from the same host as the API to mitigate CSRF attacks on unauthenticated endpoints.
- forbiddenResponse · function · L26-L28 — Constructs a 403 Forbidden JSON response for rejected requests.
