# apps/platform/features/_map/map/map-layers.sync.hooks.ts · [[highlight-synchronization]] [[per-layer-state-synchronization-pattern]] [[redux-state-slices]] [[track-correction-time-range-override]]

Synchronizes map layer highlights (features, time ranges, and events) from global state to individual layer instances via imperative callbacks, using per-layer hashes to minimize redundant updates.

- SyncableLayer · type · L29-L36 — Type definition for a map layer that can receive updates to highlighted features, time ranges, and event IDs via imperative callbacks.
- LayerHighlightHashes · type · L39-L39 — Type definition that caches hash values for each highlight kind to detect changes and avoid redundant updates.
- getFeaturePropertyId · function · L43-L60 — Extracts a unique identifier from a picked map feature by prioritizing cell ID, point index, timestamp, or stringified properties.
- getHoverFeaturesHash · function · L62-L68 — Generates a composite hash string from an array of features to detect when the hover set has changed.
- getLayerHoverFeatures · function · L70-L75 — Filters hovered features to only those belonging to or matching a specific layer.
- getLayerHighlightedFeatures · function · L77-L88 — Combines layer-specific hovered features with report area highlights if the layer matches report dataview IDs.
- toHighlightTimeMillis · function · L90-L98 — Converts ISO time string range to millisecond timestamps for layer highlight comparison.
- useSyncMapHighlights · function · L100-L203 — React hook that observes highlight state changes and imperatively updates each map layer's features, time range, and event selections only when hashes indicate actual changes.
