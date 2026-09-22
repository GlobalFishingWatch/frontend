# libs/ocean-areas/src/scripts/lib/types.ts · [[geojson-validation-and-invariants]] [[ocean-areas-data-pipeline]]

Type definitions for ocean area data configuration, including area classification types, geometry handling modes, and area metadata mappings.

- AreaType · type · L3-L3 — Enumeration of supported ocean area classification types: exclusive economic zones, marine protected areas, FAO regions, regional fisheries management organizations, and ports.
- AreaGeometryMode · type · L5-L5 — Enumeration of geometry representation modes for area data: bounding box, simplified shapes, or single point.
- AreaConfig · type · L6-L20 — Configuration object that specifies how to load, process, and map ocean area data including source path, geometry handling, property mapping, and optional filtering.
