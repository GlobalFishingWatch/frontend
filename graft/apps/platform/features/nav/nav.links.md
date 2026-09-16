# apps/platform/features/nav/nav.links.ts · [[navigation-system]]

Exports navigation link utilities and types that resolve nav item routes dynamically based on workspace context, handling state-dependent routing for workspace and search navigation.

- NavLinkContext · type · L19-L27 — Supplies the live workspace state, location flags, and event callbacks needed to dynamically resolve navigation destinations.
- NavLinkProps · type · L29-L35 — Defines the shape of properties for a navigation link—route path, params, search query, and optional handlers.
- workspaceParams · function · L54-L57 — Extracts workspace category and ID with fallbacks to defaults for use in navigation route parameters.
- getNavLinkProps · function · L100-L112 — Resolves dynamic navigation link properties by looking up item-specific logic or falling back to static route configuration with optional category callbacks.
- isNavItemCurrentLocation · function · L115-L117 — Detects whether a navigation item points to the user's current workspace location to suppress navigation.
