# apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts · [[cross-feature-scroll-synchronization]] [[redux-state-selectors-pattern]] [[vessel-activity-event-system]]

Provides React hooks for managing virtuoso-based scrolling and event selection within vessel activity event lists, including synchronization with Redux state and viewport-aware event highlighting.

- useVirtuosoScroll · function · L33-L63 — Creates debounced scroll-to-index functionality for a virtualized list with tracking of scroll state.
- useVirtuosoScrollToEvent · function · L65-L109 — Enables scrolling to and selecting a specific event by ID or index in the virtualized events list.
- useVesselProfileScrollToEvent · function · L111-L135 — Scrolls to a specific event in the vessel profile by event ID and type, ensuring the virtuoso container renders elements first.
- useEventsScroll · function · L137-L216 — Manages event selection and auto-selection of the viewport center event during scrolling, with debounced persistence to Redux.
