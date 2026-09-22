# apps/platform/features/help/UserGuideLink.tsx · [[user-guide-integration]]

React component that renders a clickable button or link to open a user guide section in a side panel with analytics tracking.

- UserGuideLinkMode · type · L14-L14 — Enum type restricting the visual presentation of the user guide link to either a button or a text link.
- UserGuideLinkProps · type · L16-L22 — Configuration object type that defines the required and optional props accepted by the UserGuideLink component.
- UserGuideLink · function · L24-L73 — React component that renders a contextual help link triggering navigation to a specific user guide section with analytics tracking.
- handleClick · function · L40-L52 — Async handler that opens the user guide side panel to the appropriate section and records a help interaction analytics event.
