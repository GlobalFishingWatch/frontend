# apps/platform/router.tsx · [[router-core]]

- parseAppWorkspace · function · L20-L22 — Parses URL search string into typed query parameters using the dataviews client utility.
- normalizeSearchString · function · L24-L30 — Normalizes URL search parameters by sorting them to match TanStack Router's SSR expectations.
- stringifyAppWorkspace · function · L32-L35 — Converts typed query parameters back into a normalized URL search string with optional leading question mark.
- getCreateRouterOptions · function · L40-L58 — Returns shared router configuration for production and test environments including error handling, scrolling, and search serialization.
- createAppRouter · function · L60-L72 — Instantiates the application router with Redux store context and full state dehydration for server and client.
- AppRouter · type · L74-L74 — Type alias for the return type of createAppRouter, representing the fully configured application router instance.
- getRouter · function · L77-L95 — Returns a cached router instance, initializing it once with store state and Sentry tracing integration in production.
