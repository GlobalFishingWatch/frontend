# libs/ocean-areas/src/scripts/lib/ports-to-geo.ts · [[geojson-validation-and-invariants]] [[port-data-transformation]]

Script that reads port data from JSON and converts it to GeoJSON format with geographic coordinates.

- PortData · type · L3-L9 — Type definition representing the raw port data structure with geographic and identity fields.
- GeoJSONFeature · type · L11-L23 — Type definition for a GeoJSON Feature representing a single port with properties and geographic point geometry.
- GeoJSON · type · L25-L28 — Type definition for the root GeoJSON FeatureCollection structure containing multiple port features.
- convertPortsToGeoJSON · function · L30-L93 — Converts raw port data to valid GeoJSON by filtering out records with missing or invalid geographic coordinates and constructing proper feature objects.
