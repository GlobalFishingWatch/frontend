# libs/deck-layers/src/layers/vessel/VesselTrackLayer.ts · [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[interactive-picking-and-enrichment]] [[multi-mode-visualization]] [[spatial-indexing-and-geometry]] [[vessel-layer-system]]

Composite deck.gl layer that renders vessel track paths with optional position/point markers and provides picking, segmentation, and graph extent calculations.

- VesselTrackLayerProps · type · L26-L30 — Configuration type for VesselTrackLayer that extends path layer props with visualization mode and hovered time.
- VesselTrackLayer · class · L32-L209 — Composite layer rendering vessel movement tracks with course calculations, spatial indexing for nearest-point picking, and multi-mode visualization (track, positions, or points).
- renderLayers · method · L150-L181 — Assembles the track path layer and conditionally adds position/point marker layer based on visualization mode.
- getData · method · L183-L185 — Returns the raw track data from props.
- getSegments · method · L187-L192 — Delegates to getSegmentsFromData utility to split track into segments while respecting time range and gap thresholds.
- getGraphExtent · method · L194-L200 — Retrieves speed or elevation graph extent from the underlying track path sublayer.
- getBbox · method · L202-L208 — Retrieves bounding box of track data for a given date range from the underlying track path sublayer.
