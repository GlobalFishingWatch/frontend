# libs/data-transforms/src/files/geotiff-bands.ts · [[defensive-parsing-and-error-normalization]] [[file-format-conversion-pipeline]]

Exports GeoTIFF error constants, type definitions, and a function to extract the band count from a GeoTIFF file header.

- GeotiffError · type · L6-L6 — Type alias for GeoTIFF error codes as string literals mapped from the GEOTIFF_ERRORS constant.
- getGeotiffBandsCount · function · L12-L24 — Extracts the number of bands from a GeoTIFF file by reading the image header and validating the sample count.
