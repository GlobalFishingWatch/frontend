# apps/platform/features/nav/PlatformNav.tsx · [[navigation-system]] [[server-side-rendering-ssr-safety-pattern]]

Expandable platform navigation rail component with sectioned menu items, hover/focus expansion on desktop, and explicit toggle on mobile.

- PlatformNav · function · L56-L370 — Renders a collapsible navigation rail with expandable sections, managing hover/focus-driven expansion on desktop and explicit toggle on small screens.
- isSectionExpanded · function · L175-L175 — Determines whether a section is visually expanded by checking if the rail is open and its id matches the active or route-derived section.
- renderIconAndLabel · function · L177-L186 — Renders the icon (or spinner if loading) and label for a navigation item.
- renderItemContent · function · L188-L242 — Renders the appropriate interactive element (external link, button, disabled span, or routed NavLink) for a navigation item based on its properties.
- renderRow · function · L244-L254 — Wraps a navigation item in a styled row container, applying active and subsection styling classes.
- renderSection · function · L256-L315 — Renders either a simple navigation row or a collapsible section with a Disclosure widget and nested subsection list.
