# apps/platform/features/nav/LegacyNav.tsx · [[navigation-system]]

Main React component that renders a legacy vertical navigation sidebar with workspace links, search, category items, and user controls.

- LegacyNavProps · type · L24-L26 — Type definition for the LegacyNav component props that specifies a menu click handler callback.
- LegacyNav · function · L28-L150 — Main navigation component that manages the layout of navigation sections including workspace, search, and category items, with memoized nav sections and conditional rendering based on active state.
- renderRow · function · L54-L84 — Renders an individual navigation item row with icon, label, routing, and tooltip display logic that disables navigation when on the current location.
