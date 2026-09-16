# libs/deck-layers/src/layers/fourwings/clusters/fourwings-clusters.types.ts · [[deck-gl-core-integration]] [[fourwings-clustering-layer]]

Type definitions for Fourwings cluster visualization layer, including cluster features, properties, and picking interactions.

- FourwingsClusterEventType · type · L14-L20 — Union type that enumerates the supported event types for clustering in Fourwings, including encounters, gaps, ports, loitering, and user datasets.
- FourwingsClusterMode · type · L22-L22 — Type alias that restricts cluster display mode to either geolocation coordinates or vessel position data.
- FourwingsClustersLayerProps · type · L24-L35 — Configuration type for the Fourwings clusters layer, specifying temporal bounds, styling, data source, and clustering behavior.
- FourwingsClusterProperties · type · L37-L47 — Data type that defines the core properties stored in each cluster, including identifier, value, spatial grid coordinates, tile reference, and temporal start point.
- FourwingsClusterFeature · type · L48-L48 — Type alias wrapping the supercluster ClusterFeature generic with Fourwings-specific cluster properties.
- FourwingsPointFeature · type · L50-L50 — Type alias representing individual unclustered point features with dynamic properties in the Fourwings clustering system.
- FourwingsClusterPickingObject · type · L51-L61 — Type that merges cluster feature data with deck.gl picking interaction metadata, enabling user interactions to retrieve cluster details and expansion parameters.
- FourwingsClusterPickingInfo · type · L63-L66 — Deck.gl PickingInfo wrapper that provides typed access to selected cluster objects along with underlying tile metadata.
