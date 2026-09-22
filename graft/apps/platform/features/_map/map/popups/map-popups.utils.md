# apps/platform/features/_map/map/popups/map-popups.utils.ts · [[feature-property-extraction]] [[map-popups-system]]

- getCleanPropertiesList · function · L17-L23 — Removes hidden metadata keys and sorts properties alphabetically for display.
- parsePropertiesList · function · L25-L38 — Formats feature properties as an HTML string, converting timestamps to localized dates based on dataset filter type.
- getContextValue · function · L40-L55 — Extracts and formats the primary display value from a feature by resolving value properties or falling back to default value.
- getContextLayerId · function · L57-L64 — Generates a unique identifier for a context feature, using special logic for offshore infrastructure layers.
- getUserContextLayerLabel · function · L66-L100 — Produces a human-readable label for user layer features, with specialized handling for infrastructure layers, drawn geometries, and fallback to context values.
- getIntervalDateFormat · function · L102-L106 — Returns appropriate date formatting options based on the data aggregation interval granularity.
