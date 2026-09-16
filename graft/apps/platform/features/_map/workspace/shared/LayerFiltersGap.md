# apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx · [[layer-filter-and-properties-components]]

Module that provides a gap-duration filter UI component for controlling the gapSegmentThreshold parameter of activity map layers with configurable hour thresholds between 0 and 24.

- LayerFiltersGapProps · type · L16-L19 — Props type for the LayerFiltersGap component specifying the dataview instance and callback to handle gap threshold changes.
- LayerFiltersGap · function · L21-L69 — React functional component that renders a filter UI for users to select a gap segment threshold value between 0 and 24 hours.
- onChange · function · L41-L52 — Updates the dataview configuration with the selected gap segment threshold and tracks the selection as an analytics event.
- onSelect · function · L54-L58 — Handles filter selection events by extracting the numeric value and delegating to the onChange callback.
