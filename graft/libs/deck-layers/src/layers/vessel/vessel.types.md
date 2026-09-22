# libs/deck-layers/src/layers/vessel/vessel.types.ts · [[vessel-layer-system]]

Defines TypeScript types and interfaces for vessel deck layer rendering, including event structures, track properties, position data, and picking information for user interactions.

- VesselDeckLayersEvent · interface · L10-L16 — Defines the structure for vessel deck layer events with type, URL, and optional dataset ID.
- VesselDataType · type · L18-L18 — Union type representing either a track layer type or API event types for vessel data.
- VesselTrackVisualizationMode · type · L19-L19 — Enumeration of track rendering modes: track lines, individual positions, or point clouds.
- _VesselLayerProps · type · L21-L32 — Configuration properties for vessel layer rendering including visibility, icons, and track visualization mode.
- VesselEventProperties · type · L40-L45 — Properties of a vessel event combining API event data with identification, display, and styling information.
- VesselTrackInteractionType · type · L47-L47 — Classification of track interaction targets as either segments or individual points.
- VesselTrackProperties · type · L49-L59 — Complete set of properties for a vessel track segment including navigation and visualization metadata.
- VesselPositionProperties · type · L61-L69 — Properties for an individual vessel position point with timestamped navigation and depth data.
- TrackLabelerPoint · type · L71-L79 — Data structure for a labeled track point with geographic position, timing, navigation, and action metadata.
- VesselEventPickingObject · type · L81-L82 — Picking object that combines vessel event properties with deck.gl picking interaction data.
- VesselEventPickingInfo · type · L83-L83 — Picking information structure for vessel events including tile metadata and object references.
- VesselTrackPickingObject · type · L85-L86 — Picking object combining vessel track properties with deck.gl interaction and picking metadata.
- VesselTrackPickingInfo · type · L87-L87 — Picking information for track segments enabling user interaction and tile-level hit detection.
- VesselPositionPickingObject · type · L89-L90 — Picking object combining vessel position properties with deck.gl picking and interaction data.
- VesselPositionPickingInfo · type · L91-L94 — Picking information for position points enabling tile-aware interaction with individual track positions.
