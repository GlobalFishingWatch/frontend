# apps/platform/features/nav/nav.hooks.ts · [[lazy-workspace-reset-pattern]] [[navigation-system]] [[router-state-integration]]

Provides React hooks for navigation UI logic, including feedback modal control, map interaction state management, and active tab detection.

- useOpenFeedbackModal · function · L38-L47 — Opens the feedback modal if the user is authenticated, keeping the feedback row inert rather than hidden for guests.
- useNavLinkContext · function · L50-L112 — Aggregates live map state and click handlers for workspace, search, and category navigation, avoiding unnecessary dependencies in the always-rendered nav component.
- useIsNavItemActive · function · L115-L150 — Determines whether a nav row represents the user's current location by matching route patterns and workspace state to render it as the active tab.
