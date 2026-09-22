# libs/deck-loaders/src/fourwings/helpers/byte-length.ts · [[byte-length-estimation]]

Module that provides utilities to estimate and assign memory byte lengths for Fourwings geospatial features.

- estimateFourwingsFeaturesByteLength · function · L8-L25 — Calculates the approximate heap memory footprint of an array of Fourwings features by summing per-feature overhead and dynamic property array sizes.
- assignFourwingsFeaturesByteLength · function · L27-L34 — Attaches the calculated byte length as an enumerable property on a feature array for deck.gl's Tileset2D cache accounting.
