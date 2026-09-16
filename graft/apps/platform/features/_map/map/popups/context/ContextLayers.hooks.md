# apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts · [[area-interaction-hooks]] [[context-layer-tooltips]] [[feature-property-extraction]]

Exports custom React hooks and utilities for managing context layer interactions and area identification in the map popup system.

- getAreaIdFromFeature · function · L20-L27 — Extracts the area identifier from a map feature by checking the gfw_id property first, then falling back to the feature's id attribute.
- useContextInteractions · function · L29-L101 — Provides callback handlers for download and report interactions on context map features, dispatching relevant Redux actions and analytics events.
