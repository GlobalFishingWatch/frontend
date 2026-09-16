# apps/platform/server.ts · [[server-entry-request-handling]]

Server entry point that configures GFW API, handles HTTP requests with Sentry integration, and manages in-flight request tracking for Vite hot module reloading.

- check · function · L25-L31 — Polls until all in-flight requests complete or a timeout elapses, then resolves to allow Vite's full reload to proceed.
- fetch · method · L38-L52 — Routes incoming requests through a proxy or to the React Start server while tracking in-flight requests, with error-safe decrementing.
