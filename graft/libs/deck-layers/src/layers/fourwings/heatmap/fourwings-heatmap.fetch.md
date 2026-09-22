# libs/deck-layers/src/layers/fourwings/heatmap/fourwings-heatmap.fetch.ts · [[binary-tile-data-fetching]] [[fourwings-heatmap-layer]]

Provides utilities to fetch and parse 4wings binary tile data from a remote API, extracting cell features and metadata headers for layer rendering.

- FetchFourwingsTileDataParams · type · L23-L41 — Type definition for parameters passed to the main tile data fetching function, specifying tile, chunk, interval, sublayers, and parsing options.
- FourwingsTileHeaders · type · L43-L49 — Type definition for HTTP response headers containing tile metadata like dimensions, scale, offset, and no-data values.
- readNumberHeader · function · L51-L58 — Parses a numeric header value from HTTP response headers, returning undefined if missing or non-finite.
- readFourwingsHeaders · function · L60-L87 — Extracts tile metadata headers (cols, rows, scale, offset, noDataValue) from an HTTP response and populates target arrays by sublayer index.
- FourwingsTileBuffers · type · L89-L93 — Type definition for the result of fetching raw tile buffers, including the binary data, buffer lengths, and extracted headers.
- fetchFourwingsTileBuffers · function · L98-L162 — Fetches raw binary tile data from multiple URLs, extracts response headers and bin metadata, and handles errors while allowing 404 failures.
- getBuffer · function · L116-L138 — Nested function that fetches a single tile buffer from a URL, parses its headers, and optionally processes bin data.
- fetchFourwingsTileData · function · L165-L231 — Main export that fetches 4wings tile data for visible sublayers, parses binary buffers using the FourwingsLoader, and returns parsed cell features.
