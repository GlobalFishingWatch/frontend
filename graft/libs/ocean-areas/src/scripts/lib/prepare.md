# libs/ocean-areas/src/scripts/lib/prepare.ts · [[geojson-validation-and-invariants]] [[ocean-areas-data-pipeline]]

Module that orchestrates the ETL pipeline for processing and simplifying geographic area data from cloud storage into consolidated JSON files.

- existsFilePath · function · L13-L18 — Utility function that checks whether a file exists at the given path using filesystem access.
- prepare · function · L20-L139 — Main async orchestrator that downloads geographic area data, filters and simplifies features, extracts properties, and writes a consolidated JSON array to disk while managing memory with periodic garbage collection.
