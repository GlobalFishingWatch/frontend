# apps/platform/features/_map/map/map-interaction.utils.ts · [[feature-classification-analytics]] [[map-interactions]]

Utility module that transforms deck layer interaction events and provides helper functions for analyzing map feature interactions and generating analytics tracking data.

- getSliceInteractionEvent · function · L21-L34 — Converts a deck layer interaction event into a store-friendly format with normalized tile geometry and viewport coordinates.
- getClickedFeatureKey · function · L36-L39 — Generates a unique identifier for a map feature combining its layer ID, feature ID, and sublayer composition.
- getNewClickedFeatures · function · L41-L47 — Identifies newly clicked map features by filtering out any features that were already present in the previous click state.
- getUpdatedClickedFeatures · function · L49-L56 — Preserves state of previously clicked features by replacing current features with their older versions when matching keys exist.
- isTilesClusterLayer · function · L58-L59 — Identifies whether a picking object represents a Fourwings tile cluster layer.
- isTilesClusterLayerCluster · function · L61-L62 — Determines if a cluster picking object represents an actual cluster with multiple vessels rather than a single point.
- isRulerLayerPoint · function · L64-L65 — Checks whether a picking object is a measurement ruler layer element.
- isBathymetryContour · function · L67-L68 — Identifies whether a picking object represents a bathymetry contour layer.
- isTrackSegment · function · L70-L72 — Determines if a picking object is a vessel track segment as opposed to other track interaction types.
- getAnalyticsEvent · function · L74-L115 — Generates a structured analytics tracking event from a map feature click, extracting category-specific metadata for logging user interactions.
