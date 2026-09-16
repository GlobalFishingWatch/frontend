# apps/platform/features/_map/timebar/timebar-interactions.hooks.ts · [[analytics-integration]] [[map-interaction-hooks]] [[timebar-interaction-hooks]]

Module providing React hooks for managing timebar interactions including range changes, mouse events, bookmarks, and time highlighting on the map.

- useTimebarBookmark · function · L39-L60 — Manages bookmark state for the timebar and tracks analytics events when bookmarks are added or removed.
- useOnTimebarRangeChange · function · L62-L99 — Creates a callback that handles timerange changes, tracks analytics, adjusts tooltips when highlighted time falls outside the new range, and refits report areas to the viewport.
- useTimebarMouseInteractions · function · L101-L208 — Provides event handlers for mouse interactions on the timebar, including highlighting time ranges on hover, toggling fixed tooltips on click, and updating map coordinates when events are clicked.
