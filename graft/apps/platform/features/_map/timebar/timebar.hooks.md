# apps/platform/features/_map/timebar/timebar.hooks.ts · [[redux-caching-pattern]] [[router-integration-navigation]] [[timebar-data-connections]]

React hooks module that connects timebar UI state and visualization logic to Redux store and query parameters, managing highlighted events, graph type, and visualization mode selection.

- useDisableHighlightTimeConnect · function · L44-L55 — Hook that provides a callback to clear the highlighted time state when a time point is currently highlighted.
- useHighlightedEventsConnect · function · L57-L93 — Hook that merges Redux-stored highlighted event IDs with hover events from deck layer composer, and provides a callback to update highlighted events with change detection.
- useTimebarVisualisationConnect · function · L95-L116 — Hook that manages timebar visualization mode selection, synchronizing it with query parameters and tracking whether settings have been manually changed.
- useTimebarEnvironmentConnect · function · L118-L133 — Hook that connects the selected environmental heatmap ID to query parameters for persistence across navigation.
- useTimebarUserPointsConnect · function · L135-L150 — Hook that connects the selected user points dataset ID to query parameters for persistence across navigation.
- useTimebarVesselGroupConnect · function · L152-L164 — Hook that connects the selected vessel group ID to query parameters for persistence across navigation.
- useTimebarGraphConnect · function · L166-L180 — Hook that connects the selected timebar graph type to query parameters for persistence across navigation.
- useTimebarVisualisation · function · L184-L265 — Hook that automatically selects an appropriate timebar visualization mode based on which data layers are active, with fallback logic to prevent empty timebars.
