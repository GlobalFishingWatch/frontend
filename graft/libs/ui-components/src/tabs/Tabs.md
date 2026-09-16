# libs/ui-components/src/tabs/Tabs.tsx · [[aria-accessibility-compliance]] [[css-modules-and-styling-architecture]] [[icon-and-button-ui-elements]] [[tab-navigation]]

A reusable tab component that manages multiple tab views with lazy loading, accessibility features, and customizable styling.

- TabsProps · interface · L11-L20 — Defines the configuration interface for the Tabs component, including tab data, selection state, callbacks, and styling options.
- Tabs · function · L22-L118 — Renders a tabbed interface with lazy-loaded content, tracking which tabs have been mounted and handling tab selection events.
- handleTabClick · function · L41-L52 — Records tab access by adding clicked tabs to the loaded tabs list and delegates to the optional user-provided click handler.
