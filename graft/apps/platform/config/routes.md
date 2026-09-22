# apps/platform/config/routes.ts · [[platform-configuration]] [[route-synchronization-invariant]]

- RoutePathKey · type · L31-L31 — Type that extracts the union of all route path keys to ensure type-safe access to ROUTE_PATHS configuration.
- RoutePathValues · type · L32-L32 — Type that extracts the union of all route path URL patterns to enable typed access to path values.
- ROUTE_TYPES · type · L35-L35 — Type alias that enforces route type names to match route path keys, preventing drift between routing configuration and Redux location types.
