# apps/platform/utils/files.ts · [[file-handling-and-upload-utilities]]

Utility module for file type detection, validation, and conversion supporting multiple geospatial and data formats (GeoJSON, CSV, KML, Shapefile, GeoTIFF, NetCDF).

- getFileName · function · L16-L23 — Extracts and normalizes a filename by removing extension and applying lowercase with capitalization.
- FileType · type · L25-L25 — Type alias for supported dataset configuration source file formats.
- MimeExtention · type · L26-L50 — Union type enumerating all supported file extensions (case-variants) for GeoJSON, ZIP, CSV, TSV, KML, KMZ, Shapefile, GeoTIFF, and NetCDF formats.
- MimeType · type · L51-L62 — Union type of MIME types corresponding to supported geospatial and data file formats.
- MimeExtentionWithoutShp · type · L64-L64 — Conditional type that excludes Shapefile extensions (.shp, .SHP) from MimeExtention for MIME type lookup.
- DatasetGeometryTypesSupported · type · L91-L94 — Type constraining supported geometry types to polygons, tracks, points, and gridded datasets.
- getFileTypes · function · L103-L104 — Returns the list of supported file types for a given dataset geometry type.
- FileConfig · type · L106-L106 — Data structure defining metadata for a file type: its identifier, supported extensions, and icon name.
- FileTypeResult · type · L126-L126 — Result type containing detected file type and optionally decompressed ZIP content entries.
- getFileType · function · L127-L145 — Determines the file type of an uploaded file by checking extension or ZIP contents against supported file type configurations.
- getFileFromZipContent · function · L147-L161 — Extracts the first matching file entry from a ZIP archive based on file type extensions, enforcing single-file constraint.
- getFilesAcceptedByMime · function · L163-L183 — Builds a MIME-to-extensions mapping for a given set of file types to populate HTML file input accept attributes.
- readBlobAs · function · L187-L207 — Reads a Blob as either UTF-8 text or ArrayBuffer using the FileReader API with overloaded return types.
- getFileFromGeojson · function · L209-L221 — Converts a GeoJSON FeatureCollection into a File object by manually serializing its structure to JSON.
