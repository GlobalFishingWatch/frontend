# libs/ocean-areas/src/scripts/ports-to-list.ts · [[data-quality-filtering]] [[port-data-transformation]]

Script that converts raw GeoJSON port features into a filtered TypeScript module export of port metadata.

- PortFeature · type · L5-L17 — GeoJSON Feature type schema for port data with geographic location and port-specific metadata.
- PortListData · type · L18-L22 — Simplified port data structure containing only the essential identity, name, and flag attributes.
- isPlaceholderName · function · L28-L39 — Detects whether a port name is a placeholder (numeric, hex string, or ISO-format code) rather than a human-readable name.
- quote · function · L41-L43 — Wraps a string value in single or double quotes, choosing the appropriate delimiter to avoid internal quote escaping.
- toTsModule · function · L45-L54 — Transforms a port list into a TypeScript module string with properly quoted object literals for export.
- convertPortsToList · function · L56-L89 — Reads a GeoJSON port file, filters out invalid and placeholder entries, and writes the cleaned data as a TypeScript module.
