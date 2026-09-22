---
name: Data-Transforms Library Architecture
slug: data-transforms-library-architecture
type: system
sources:
  - path: libs/data-transforms/eslint.config.js
    hash: f4b8d65ebbc93fe43ef6ba67d31c4a5a7e461dadba54eadb8263a58bea75dc53
  - path: libs/data-transforms/src/index.ts
    hash: c4ed5d87e522bb1b8e3d32340a820e048666ee44912386be488fe51014416c0e
sources_digest: 7d26d5059190dd6623c1b2b4ab360eeb93eb7c494f7828617f3d9c22d2bc6fc0
links:
  - to: file-format-conversion-pipeline
    relation: uses
    description: >-
      Library exports file conversion modules for KML, Shapefile, NetCDF, and
      GeoTIFF parsing
  - to: geospatial-data-transformations
    relation: uses
    description: >-
      Library exports geospatial transformation modules for coordinate, feature,
      and geometric operations
  - to: temporal-data-handling
    relation: uses
    description: >-
      Library exports date parsing and formatting utilities for temporal
      normalization
  - to: track-segment-processing-pipeline
    relation: uses
    description: >-
      Library exports track processing modules for CSV-to-segment conversion and
      filtering
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Comprehensive monorepo library exporting geospatial, temporal, and data transformation utilities organized as sixteen focused modules: coordinate transformation (buffer, coordinates, wrap-longitudes), track processing (merge-track-chunks, filter-tracks-coordinates, list-to-track-segments, track-value-array-to-segments), data normalization (dates, numbers, dissolve, union), file conversion, feature/point handling, and segment operations. The architecture emphasizes composable, single-responsibility modules over monolithic utilities, enabling selective imports and reducing coupling across consuming code.

## Related

- uses [[file-format-conversion-pipeline]] — Library exports file conversion modules for KML, Shapefile, NetCDF, and GeoTIFF parsing
- uses [[geospatial-data-transformations]] — Library exports geospatial transformation modules for coordinate, feature, and geometric operations
- uses [[temporal-data-handling]] — Library exports date parsing and formatting utilities for temporal normalization
- uses [[track-segment-processing-pipeline]] — Library exports track processing modules for CSV-to-segment conversion and filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
