# apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx · [[dataviews-datasets-state]] [[feature-grouping-pattern]] [[map-popup-system]]

Module that provides tooltip sections for rendering vessel event information on the map, including encounter details and event descriptions.

- EventDescription · function · L34-L113 — Component that renders a detailed description of a vessel event, including encounters with other vessels and navigation links to vessel profiles.
- VesselEventsTooltipSectionProps · type · L115-L118 — Type definition for the props object of the VesselEventsTooltipSection component.
- VesselEventsTooltipSection · function · L120-L188 — Component that groups and renders multiple vessel events by vessel ID in a popup, handling overflow when event count exceeds the maximum tooltip limit.
