# apps/platform/features/_map/map/map-interactions.hooks.ts · [[feature-classification-analytics]] [[map-interactions]]

- useGetAreClusterTilesLoading · function · L91-L103 — Returns a callback that checks whether event cluster tiles are still loading for a given set of dataviews.
- useInteractionHandlers · function · L109-L252 — Aggregates four handlers for distinct map layer interactions: heatmaps, detection positions, tile clusters, and vessel events.
- useClickedEventConnect · function · L254-L393 — Manages the lifecycle and dispatch of a clicked map event, including coordinate mapping, cluster zoom expansion, and deferred handler invocation.
- useGetPickingInteraction · function · L395-L437 — Converts a deck.gl picking info object into a normalized InteractionEvent with deduplicated features.
- isDataviewLayerLoaded · function · L442-L446 — Checks whether a dataview layer has finished loading by inspecting the jotai deck layers state atom.
- waitForLayersUpdate · function · L448-L467 — Waits for deck layers to finish updating and resolves true if the state becomes current, or false if the request becomes outdated.
- useRefreshClickedEvent · function · L469-L549 — Triggers a re-pick of features at the last clicked location when a dataview's visibility changes, then redispatches interaction handlers if still valid.
- isOutdated · function · L495-L502 — Determines if a refresh request has been superseded by a newer one or if the clicked position has changed.
- pickFeatures · function · L504-L510 — Re-picks features at the stored click coordinates using the current deck.gl viewport.
- useMapMouseHover · function · L554-L599 — Debounces and dispatches deck.gl hover interactions, updating the hover state and triggering associated handlers.
- useMapHoverCoordinates · function · L601-L604 — Provides the current hover coordinates from the deck hover interaction atom.
- useMapMouseClick · function · L606-L633 — Wraps and dispatches a click event to the clicked event handler, converting mjolnir pointer events to deck.gl interaction events.
- useMapCursor · function · L635-L694 — Manages the mouse cursor style based on map state (annotation, ruler editing, hover layer) and deck layer hover context.
- useMapDrag · function · L696-L737 — Handles map panning via mouse drag, delegating to deck.gl's built-in drag interaction or ruler-specific drag handlers.
- useDebouncedDispatchHighlightedEvent · function · L739-L753 — Debounces the dispatch of highlighted timebar events triggered by map hovers to avoid excessive state updates.
