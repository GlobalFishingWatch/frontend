# libs/deck-layers/src/layers/bathymetry-contour/BathymetryContourLayer.ts · [[bathymetry-contour-layer]] [[gpu-accelerated-shader-highlighting]] [[vector-tile-layer-infrastructure]]

- _ContextLayerProps · type · L36-L36 — Type alias combining tile layer and bathymetry-specific configuration properties.
- isIndexContour · function · L58-L58 — Predicate determining whether a depth contour is a major index line (e.g., -200m, -1000m) rather than an intermediate contour.
- _BathymetryContourPathLayerProps · type · L60-L70 — Type definition for per-instance and per-layer rendering properties specific to bathymetry contour line styling and highlighting.
- BathymetryContourPathLayerProps · type · L92-L93 — Union of bathymetry-specific props and deck.gl PathLayer props for type-safe layer configuration.
- BathymetryContourPathLayer · class · L108-L176 — Specialized PathLayer that renders bathymetry contour lines with GPU-driven highlight and zoom-fade effects via vertex shader uniforms to avoid expensive per-hover re-tessellation.
- getShaders · method · L115-L144 — Injects custom GLSL modules and vertex shader filters to apply dynamic highlighting and zoom opacity to contour lines.
- initializeState · method · L146-L155 — Registers the per-instance elevation attribute so contour elevation values can be passed to the vertex shader for highlight comparisons.
- draw · method · L157-L175 — Updates GPU uniforms for highlight color, zoom opacity, and highlight width before rendering the path geometry.
- isBelowSeaLevel · function · L178-L178 — Predicate checking whether an elevation value represents a submarine depth (zero or negative).
- BathymetryPathFeature · type · L180-L180 — Data type representing a single contour line segment with its properties and coordinate path.
- isLabelFeature · function · L182-L183 — Type guard distinguishing Point-geometry features (labels) from LineString/MultiLineString features (contours).
- BathymetryContourLayer · class · L191-L405 — Composite deck.gl layer rendering bathymetry contours with depth filtering, dynamic highlighting on hover, and aligned depth labels with collision detection.
- shouldUpdateState · method · L204-L206 — Determines whether layer state needs updating when zoom level (bucketed to 0.5 precision) or other properties change.
- updateState · method · L208-L210 — Recomputes the zoom bucket whenever the viewport zoom level changes substantially.
- setHighlightedFeatures · method · L299-L301 — Debounced handler to update the highlighted elevation when the user hovers over a contour line.
- finalizeState · method · L303-L306 — Cleans up debounced highlight callbacks when the layer is destroyed to prevent memory leaks.
- renderLayers · method · L320-L404 — Composes and returns a PMTilesLayer that renders contour paths and labels, filtered by optional depth groups and styled by index/intermediate contour type.
- matchesDepth · function · L329-L330 — Predicate ensuring a contour belongs to the user-selected depth group and is below sea level.
