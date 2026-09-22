# apps/platform/proxy.ts · [[configuration-environment]]

Basic auth proxy middleware for TanStack Start that gates app routes by username/password while excluding API endpoints and the monitoring path.

- createAuthRequiredResponse · function · L12-L17 — Generates a 401 response with HTTP Basic authentication challenge headers.
- isMonitoringPath · function · L19-L22 — Determines whether a request path matches the monitoring endpoint that bypasses authentication.
- isApiPath · function · L26-L28 — Checks whether a path is an API route that should bypass basic authentication gating.
- ProxyResult · type · L30-L33 — Discriminated union type representing the outcome of proxy request processing: returning a response, modifying a request, or passing through.
- proxy · function · L35-L74 — Main middleware function that intercepts requests to enforce basic authentication on app routes while exempting monitoring and API endpoints.
