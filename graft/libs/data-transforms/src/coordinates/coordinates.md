# libs/data-transforms/src/coordinates/coordinates.ts · [[coordinate-validation-and-normalization]] [[geospatial-data-transformations]]

Coordinate validation and parsing utilities for safe map projection of geographic points.

- isValidCoordinate · function · L9-L11 — Validates that a coordinate value is a finite number, rejecting null, undefined, empty strings, and non-numeric strings while allowing zero.
- isValidLngLat · function · L13-L20 — Verifies that longitude and latitude values are valid coordinates and latitude falls within the geographically valid range of -90 to 90 degrees.
- toLngLatCoordinates · function · L22-L27 — Converts validated longitude and latitude inputs to a tuple array, returning null if validation fails.
- parseCoords · function · L29-L45 — Parses latitude and longitude from numbers or strings (including formatted coordinate strings) into a normalized object, using geo-coordinates-parser for format conversion.
