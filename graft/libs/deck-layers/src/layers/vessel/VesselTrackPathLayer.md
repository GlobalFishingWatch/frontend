# libs/deck-layers/src/layers/vessel/VesselTrackPathLayer.ts · [[color-and-configuration-management]] [[deck-gl-layer-foundation]] [[global-fishing-watch-api-integration]] [[shader-based-filtering-and-highlighting]] [[spatial-indexing-and-geometry]] [[temporal-filtering-architecture]] [[vessel-layer-system]]

Deck.GL layer implementation that renders vessel movement paths with time-based filtering, speed/elevation coloring, and interactive highlighting capabilities.

- TrackShaderAttributeFlags · type · L21-L25 — Boolean flags indicating which attribute types (speed, elevation, gap) the current shader configuration requires.
- TrackShaderLayoutProps · type · L27-L35 — Type alias selecting the shader-layout-relevant properties for determining which shader variant to use.
- getNarrowestLonSpan · function · L40-L52 — Chooses the more compact longitude range between standard (-180..180) and shifted (0..360) coordinate systems to avoid dateline wrapping artifacts.
- getTrackShaderAttributeFlags · function · L54-L68 — Determines which optional shader attributes (speed, elevation, gap) must be included based on the current color-by mode and filter settings.
- getTrackShaderLayoutKey · function · L70-L74 — Generates a short cache key string identifying which variant of the track shader layout is needed based on enabled attributes.
- _VesselTrackPathLayerProps · type · L77-L183 — Type definition for VesselTrackPathLayer-specific properties controlling time ranges, filters, graph extent, highlighting, and data access.
- generateShaderColorSteps · function · L185-L202 — Produces a chain of conditional GLSL statements that map speed or elevation values to colors using predefined steps.
- VesselTrackPathLayerProps · type · L229-L230 — Complete props type combining VesselTrackPathLayer-specific properties with standard deck.gl PathLayer properties.
- VesselTrackPathLayer · class · L311-L596 — Deck.gl layer component rendering animated vessel tracks with time-based filtering, speed/elevation coloring, and interactive highlighting via custom shaders.
- getShaders · method · L318-L408 — Constructs vertex and fragment shader modules with conditional attributes and filtering logic for time windows, speed/elevation filters, and gap detection.
- getPropsInstancedAttributes · method · L410-L441 — Returns instanced shader attribute definitions for speed, elevation, and gap data conditionally based on coloring and filtering modes.
- initializeState · method · L443-L459 — Sets up the attribute manager with timestamp and conditional speed/elevation/gap attributes for shader data binding.
- draw · method · L461-L528 — Executes the render pass, computing graph step colors/values and rebasing timestamps, then configuring shader uniforms before drawing.
- rebase · function · L505-L505 — Utility function that converts absolute timestamps to relative values by subtracting the data's timestampBase offset.
- getData · method · L530-L532 — Returns the typed VesselTrackData payload containing coordinates, timestamps, and optional attribute data for the track.
- getSegments · method · L534-L536 — Extracts track segments (movement sections) from the data using optional filtering parameters.
- getGraphExtent · method · L538-L542 — Retrieves the min/max domain values for speed or elevation attributes to support graph scaling and color-step generation.
- getBbox · method · L544-L595 — Computes a geographic bounding box for track points within an optional date range, accounting for timestamp rebasing and longitude wrapping.
