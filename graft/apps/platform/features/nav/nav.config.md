# apps/platform/features/nav/nav.config.ts · [[navigation-system]]

Configuration file that defines navigation menu items and related types for the platform's UI.

- TFunc · type · L13-L13 — Type alias for the translation function returned by react-i18next.
- NavItem · type · L15-L38 — Data structure defining a navigation menu item with label, icon, routing, and optional nested subsections.
- RoutedNavItem · type · L40-L40 — Specialization of NavItem that requires a valid registered route destination.
- isRouted · function · L42-L44 — Type guard that narrows a NavItem to RoutedNavItem when it has a defined `to` route.
- getCategoryItems · function · L47-L54 — Generates navigation items for workspace categories with optional icons and localized labels.
- helpHubSectionParams · function · L56-L56 — Builds route parameters object for help hub section navigation links.
- getPlatformNavSections · function · L58-L147 — Constructs the main navigation menu sections (home, map, vessels, help) with localized labels and route parameters.
- getPlatformBottomSections · function · L149-L208 — Builds the footer navigation items (assistant, feedback, language switcher, settings) with handlers and dynamic language options.
