# apps/platform/features/_map/map/popups/context/area-tooltip-timeseries.hooks.ts · [[area-tooltip-timeseries-computation]] [[map-popup-system]]

- TooltipCategory · type · L49-L49 — Type alias for the three categories of data that can be displayed in area tooltip sparklines.
- TooltipSparklineOption · type · L51-L56 — Type defining a selectable sparkline option with its id, display label, and data category.
- useAreaTooltipSparklineCategory · function · L58-L95 — Hook that builds and manages the list of available sparkline categories (activity, detections, environmental) based on active dataviews.
- useAreaRowExpansion · function · L97-L115 — Hook that manages the expand/collapse state of area rows in tooltip lists, auto-expanding single rows.
- isLonRangeContained · function · L117-L125 — Utility function that checks if one longitude range is fully contained within another, accounting for antimeridian wrapping.
- useAreaDetail · function · L127-L148 — Hook that retrieves and optionally fetches detailed area metadata including geometry and bounds from the data store.
- useAreaInViewport · function · L150-L180 — Hook that determines if an area's bounds are currently visible in the map viewport, latching visibility while a tooltip row remains open.
- useFitAreaBounds · function · L182-L221 — Hook that provides a callback to animate the map to fit an area's bounds, handling both user tracks and spatial areas.
- AreaTooltipTimeseries · type · L223-L228 — Type defining the shape of timeseries data returned for area tooltips, including loading state and time range.
- useAreaTooltipTimeseries · function · L230-L317 — Hook that computes and caches timeseries data from map layer instances filtered by an area polygon, updating when geometry or category changes.
- run · function · L281-L302 — Async function that filters layer features by area polygon and computes aggregated timeseries values.
