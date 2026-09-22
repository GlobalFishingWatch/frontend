# apps/platform/features/_map/map/map-view-state.hooks.ts · [[dual-jotai-deck-gl-state-synchronization]] [[map-view-state-management]] [[web-mercator-projection-constraint]]

- getSafeViewState · function · L9-L28 — Sanitizes map view state coordinates by clamping latitude to Web Mercator bounds and filtering out invalid numeric values.
- useMapSetViewState · function · L30-L39 — Returns a throttled function that updates the global view state atom with validated map coordinates.
- useSetMapCoordinates · function · L43-L60 — Hook that updates map coordinates only when not transitioning, synchronizing both the global view state and the Deck.gl map instance.
