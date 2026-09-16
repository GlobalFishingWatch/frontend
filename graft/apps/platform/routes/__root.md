# apps/platform/routes/__root.tsx · [[root-route]]

Root route configuration file for the Global Fishing Watch platform application.

- PanelWidthsState · type · L29-L33 — Type defining the state shape for layout panel width measurements across screen dimensions.
- loadPanelWidths · function · L41-L47 — Server function that retrieves cached panel width measurements from the current request context.
- loadUser · function · L49-L55 — Server function that resolves the current user's authentication state from the request context.
- RootDocument · function · L73-L107 — HTML document wrapper that renders the application shell with fonts, styles, and Google Tag Manager tracking.
- RootComponent · function · L109-L143 — Renders the root React component with conditional HTML wrapper based on test environment and i18n provider.
