# libs/skills/src/decode-url/decode.ts · [[url-decoding-for-map-state]]

- DecodedLayer · type · L11-L19 — Type representing a decoded layer with its visibility, styling, and filter configuration.
- DecodedMapUrl · type · L21-L34 — Type representing the complete decoded map URL state including route, workspace metadata, viewport, layers, and contextual filters.
- pickByPrefix · function · L36-L41 — Utility that extracts state entries matching any of the given key prefixes, returning undefined if none match.
- decodeMapUrl · function · L43-L87 — Parses a workspace URL into structured route, viewport, layers, and metadata, with fallback basename handling.
