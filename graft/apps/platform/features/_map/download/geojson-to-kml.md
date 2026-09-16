# apps/platform/features/_map/download/geojson-to-kml.ts · [[track-download-format-conversion]]

Converts GeoJSON FeatureCollections to KML 2.2 format with optional per-point timestamps using Google's gx:Track extension for animated playback in Google Earth.

- escapeXml · function · L11-L15 — Escapes XML special characters in strings to prevent malformed KML output.
- toIsoString · function · L18-L22 — Converts timestamp values to ISO 8601 strings, handling null/undefined/invalid inputs by returning empty strings.
- TrackLine · type · L24-L28 — Data structure holding coordinates, associated timestamps, and a display name for a single track segment.
- getFeatureLines · function · L30-L46 — Extracts track line segments and their metadata from a GeoJSON Feature, handling both LineString and MultiLineString geometries.
- lineString · function · L48-L53 — Generates KML LineString XML element from a list of coordinates.
- track · function · L57-L63 — Generates KML gx:Track XML element that pairs timestamps with coordinates for Google Earth animation.
- lineToPlacemark · function · L65-L72 — Converts a track line to a KML Placemark, using gx:Track when all timestamps are present, falling back to LineString otherwise.
- geoJsonToKml · function · L74-L83 — Transforms a GeoJSON FeatureCollection into a complete KML document with named placemarks for each track segment.
