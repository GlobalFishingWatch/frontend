# apps/platform/features/_map/workspace/context-areas/context.utils.ts · [[context-areas-management-system]]

Utility module for filtering and parsing geographic context features displayed on the map.

- FilterFeaturesByCenterDistanceParams · type · L23-L26 — Type definition specifying parameters for filtering geographic features by their proximity to the map viewport center.
- filterFeaturesByDistance · function · L27-L43 — Filters geographic context features to return only the closest ones to the current map viewport, limited to a specified maximum count.
- parseContextFeatures · function · L45-L60 — Transforms raw feature data by extracting and normalizing geographic identifiers based on dataset configuration.
