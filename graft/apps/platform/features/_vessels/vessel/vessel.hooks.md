# apps/platform/features/_vessels/vessel/vessel.hooks.ts · [[map-layer-integration]] [[vessel-hook-utilities]]

Module exporting React hooks for vessel profile management, layer retrieval, event visibility, and vessel information lookup by dataview.

- useVesselProfileLayer · function · L32-L36 — Retrieves the deck layer for the currently selected vessel profile.
- useVesselProfileEncounterLayer · function · L38-L52 — Resolves and retrieves the deck layer for an encountered vessel in a track event, choosing between profile or temporary encounter instance based on workspace state.
- useUpdateVesselEventsVisibility · function · L54-L74 — Automatically hides loitering or fishing events based on vessel shiptype when a new vessel is loaded without explicit URL-specified visibility settings.
- useGetVesselInfoByDataviewId · function · L76-L96 — Fetches vessel identity information and deck layer for a given dataview ID by resolving the dataview from active and custom user dataviews.
