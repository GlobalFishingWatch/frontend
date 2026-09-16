---
name: Segments Configuration Constants
slug: segments-configuration-constants
type: file
sources:
  - path: libs/data-transforms/src/segments/segments.config.ts
    hash: a81e7e43e4537f606dfb2786fa655b1ac50cc8e58ae41da1bef7917b68bc46bd
sources_digest: 2bce464aa2f86c817b22efd07f4d144e9779e8fdfd2133b3b58b8c6ddf3c7fad
links:
  - to: segments-to-geojson-conversion
    relation: part_of
    description: >-
      Provides constants used throughout segment processing for consistent
      property naming
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Centralized constants module defining standardized property names for coordinate metadata in segment data structures. Exports COORDINATE_PROPERTY_TIMESTAMP ('times' field) for temporal data and COORDINATES_PROPERTIES_ID for coordinate property collections. Eliminates magic string duplication across the segments transformation pipeline.

## Related

- part of [[segments-to-geojson-conversion]] — Provides constants used throughout segment processing for consistent property naming

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
