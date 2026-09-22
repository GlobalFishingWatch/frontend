# apps/platform/features/_map/content-panel/contentPanel.hooks.ts · [[content-panel-layout-and-navigation]] [[router-and-url-state-management]]

React hooks module providing side panel and scroll management functionality for the map content panel feature.

- SidePanelTarget · type · L5-L10 — Discriminated union type defining the possible panel targets (userGuide, datasets, userDataset, dataTerminology, chat) with their associated identifiers.
- useSidePanel · function · L12-L40 — React hook providing functions to open and close the side panel by updating query parameters with panel type, id, and subcontent id.
- useScrollToTopOnChange · function · L42-L48 — React hook that scrolls a DOM element to the top whenever a specified dependency value changes.
