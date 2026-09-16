# apps/platform/features/_map/map/popups/activity/PositionsTooltipSection.tsx · [[map-popup-system]]

- PositionsTooltipSectionProps · type · L19-L24 — Type defining the props contract for the PositionsTooltipSection component, specifying features, visibility, loading, and error states.
- PositionsTooltipSection · function · L26-L100 — React component that renders vessel positions as expandable tooltip sections, either grouped by layer with details or as simple individual position rows.
- getIconProps · function · L40-L47 — Computes icon properties for a position feature, selecting vessel or circle icon based on bearing availability and applying rotation transform.
- getTitle · function · L50-L55 — Resolves the display title for a feature by looking up its associated dataview instance and formatting with privacy settings.
