# libs/deck-layers/src/layers/fourwings/clusters/FourwingsClustersLayer.ts · [[fourwings-clustering-layer]] [[supercluster-integration]]

Main source file for the Fourwings clusters visualization layer, which renders and manages clustered fishing event data with zoom-dependent aggregation.

- FourwingsClustersTileLayerState · type · L66-L76 — Type definition for the internal state of the clusters layer, holding cluster data, indices, and visualization metadata.
- SuperclusterIndex · type · L113-L116 — Type alias extending Supercluster with optional point count metadata for introspecting cluster index size.
- getClusterIndexSize · function · L118-L122 — Utility function that safely extracts the total number of points indexed in a Supercluster instance.
- getFourwingsGeolocation · function · L124-L139 — Determines the active geolocation mode (country, port, or default) for clustering based on zoom level thresholds.
- FourwingsClustersLayer · class · L141-L591 — Composite layer class that renders clustered fishing events with dynamic aggregation, zoom-based switching, and interactive picking.
- cacheHash · method · L148-L150 — Getter that returns a cache key based on viewport load state to invalidate layer caches when data loads.
- clusterMode · method · L152-L160 — Getter that resolves the current clustering mode (positions, country, port, or default) based on viewport zoom and layer configuration.
- interval · method · L162-L164 — Getter that calculates the time interval window for data aggregation from the layer's start and end time props.
- getError · method · L166-L168 — Accessor method that retrieves the last recorded error message from the layer state.
- initializeState · method · L170-L186 — Lifecycle hook that initializes layer state with an empty Supercluster index and default data structures.
- _getHighlightedFeatures · method · L188-L190 — Helper method that returns the current set of user-highlighted features, defaulting to an empty array.
- updateState · method · L199-L226 — Lifecycle hook that reclusters data when zoom level changes significantly, switching between individual points and aggregated clusters.
- renderLayers · method · L488-L562 — Render method that assembles TileLayer, IconLayer for individual points, and ScatterplotLayer/TextLayer for clusters into the composite visualization.
- getData · method · L564-L566 — Accessor method that exposes the current point data array from layer state.
- setHighlightedFeatures · method · L568-L575 — Mutator method that updates the set of highlighted features and triggers a visual refresh.
- getViewportData · method · L577-L590 — Accessor method that returns the combined set of visible clusters and individual points in the current viewport.
