# libs/deck-loaders/src/fourwings/lib/parse-fourwings-vectors.ts · [[fourwings-vector-loader]]

Parses Fourwings vector data (u/v wind components) from PBF buffers, computing velocity and direction metrics for geographic cells with optional temporal aggregation.

- VectorProcessingContext · type · L29-L34 — Holds scale, offset, and unit configuration needed to descale and convert vector component values.
- processVectorValue · function · L37-L45 — Descales a raw PBF integer value and checks for no-data sentinel, returning a number or undefined.
- calculateVelocity · function · L48-L60 — Computes wind speed magnitude from u and v components and converts to requested units (knots, km/h, or m/s).
- calculateDirection · function · L63-L69 — Computes wind direction in degrees (0–360) from u and v components using atan2 trigonometry.
- processVectorComponents · function · L72-L88 — Validates and processes u and v values, returning computed velocity and direction or null if data is missing or invalid.
- getVectorContext · function · L91-L98 — Extracts scale, offset, unit, and no-data configuration from parsing options with sensible defaults.
- createTileBBox · function · L101-L104 — Converts tile metadata into a bounding box array format [west, south, east, north].
- CreateVectorFeatureParams · type · L106-L115 — Parameter bundle specifying cell number, tile bounding box, grid resolution, and temporal metadata for feature creation.
- createFeature · function · L118-L152 — Creates a FourwingsFeature record with coordinates, cell properties, and pre-allocated velocity and direction arrays.
- getCellVectorValuesAggregated · function · L154-L198 — Parses aggregated (single-timestep) wind vector data from PBF, computing and storing velocity and direction per cell.
- getCellVectorValues · function · L200-L303 — Parses temporal wind vector data from PBF with multiple timesteps per cell, deriving frame offsets and filling velocity/direction arrays.
- parseFourwingsVectors · function · L305-L325 — Orchestrates Fourwings vector parsing by selecting aggregated or temporal decoder and returning final feature array with byte metadata.
