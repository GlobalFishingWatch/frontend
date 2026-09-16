# libs/deck-layer-composer/src/resolvers/clusters.ts · [[deck-layer-composition-rendering]]

Module that resolves Fourwings cluster layer properties from dataview configurations for deck rendering.

- getDateRangeQuery · function · L18-L40 — Computes an ISO 8601 date range string by reconciling user-provided time bounds with dataset availability extent and rounding to hour boundaries.
- resolveDeckFourwingsClustersLayerProps · function · L42-L103 — Constructs Fourwings cluster layer properties from a dataview instance by extracting dataset metadata, computing tile URLs, and resolving temporal and filter configurations.
