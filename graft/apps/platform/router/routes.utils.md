# apps/platform/router/routes.utils.ts · [[route-configuration]]

Utilities for type-safe route navigation and path-to-type mapping for TanStack Router integration with legacy Redux location state.

- normalizeRoutePath · function · L31-L33 — Removes trailing slashes from index route paths to ensure consistent matching with ROUTE_PATHS literals.
- mapRoutePathToType · function · L43-L51 — Converts a route's full path to its legacy ROUTE_TYPES constant for Redux state, with fallback to MAP and development warnings.
- mapRouteIdToPath · function · L57-L61 — Maps TanStack Router's routeId (path pattern) to the corresponding ROUTE_PATHS constant with fallback to MAP route.
- getCurrentAppUrl · function · L67-L79 — Retrieves the current full application URL from router state, applying the PATH_BASENAME prefix if needed.
