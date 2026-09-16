# libs/skills/src/encode-url/encode.ts · [[ais-distance-filter-default-preservation]] [[time-range-snapping-to-fourwings-intervals]] [[url-encoding-for-map-state]]

- withDataviewId · function · L20-L31 — Resolves missing dataviewIds for layer-library instances using the dictionary lookup.
- withSnappedTimeRange · function · L35-L47 — Aligns start/end timestamps to fourwings interval resolution boundaries matching app rendering precision.
- withReportContextLayers · function · L58-L78 — Automatically injects boundary visualization layers for area-report datasets to ensure context is always rendered.
- withAisDefaultFilters · function · L83-L103 — Injects the app's distance-from-port default filter into AIS layers when custom filters are specified.
- MapState · type · L105-L105 — Type alias combining base workspace configuration with arbitrary additional properties.
- EncodeMapUrlInput · type · L107-L112 — Input parameters for URL encoding: map route, optional state overrides, and optional app basename.
- EncodeMapUrlResult · type · L114-L119 — Output structure containing both TanStack Router navigation config and encoded URL path.
- encodeMapUrl · function · L121-L142 — Main export that transforms map state and route into URL-safe navigation by applying sequential transformations and encoding.
