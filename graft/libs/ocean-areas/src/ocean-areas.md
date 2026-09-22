# libs/ocean-areas/src/ocean-areas.ts · [[lazy-loaded-static-data-with-synchronous-imports]] [[ocean-areas-geospatial-querying]] [[zoom-aware-localization-with-fallback-hierarchy]]

Module providing utilities to search, locate, and retrieve geographic ocean areas including exclusive economic zones, marine protected areas, FAO regions, and ports.

- importOceanAreasData · function · L19-L24 — Lazy-loads ocean area GeoJSON features and locale translations from data modules on first access.
- OceanAreaLocaleKey · type · L26-L26 — String identifier for ocean area names used in locale lookup tables.
- OceanAreaType · type · L27-L27 — Enumeration of ocean area classification types.
- OceanAreaBBox · type · L28-L28 — Bounding box coordinate tuple representing geographic bounds.
- OceanAreaProperties · interface · L32-L40 — Data schema for geographic ocean area features including type, name, area measurements, and optional boundaries.
- OceanArea · type · L42-L42 — GeoJSON Feature wrapper for ocean area properties and geometry.
- OceanAreaLocale · enum · L44-L49 — Enumeration of supported localization languages for ocean area names.
- GetOceanAreaNameLocaleParam · type · L63-L65 — Parameter type for optional locale specification in ocean area queries.
- localizeName · function · L67-L72 — Returns localized name translation for an ocean area identifier or falls back to the original name.
- localizeArea · function · L74-L91 — Applies locale translations to all feature names within a GeoJSON FeatureCollection.
- SearchOceanAreaParams · type · L93-L93 — Parameter type for ocean area search including optional locale and feature type filtering.
- searchOceanAreas · function · L94-L121 — Searches ocean areas by name query, returning ranked and filtered results sorted by type priority.
- LatLon · interface · L123-L126 — Geographic coordinate pair representing latitude and longitude.
- Viewport · interface · L128-L130 — Map viewport with geographic center coordinates and zoom level.
- getOverlappingAreas · function · L132-L143 — Identifies all ocean areas containing the given point, sorted by area size.
- getAreasByDistance · function · L145-L155 — Returns ocean areas sorted by distance from the given point.
- GetOceanAreaParams · type · L160-L160 — Parameter type for ocean area retrieval including optional locale and feature type filtering.
- getOceanAreas · function · L161-L183 — Retrieves ocean areas containing a point, or the closest area if none overlap, with optional filtering and localization.
- GetOceanAreaNameParams · type · L185-L185 — Parameter type for ocean area name lookup including locale and EEZ combination options.
- getOceanAreaName · function · L186-L210 — Returns a localized ocean area name for a map viewport, conditionally combining EEZ and ocean area names based on zoom level.
