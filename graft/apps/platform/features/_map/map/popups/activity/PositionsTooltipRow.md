# apps/platform/features/_map/map/popups/activity/PositionsTooltipRow.tsx · [[map-popup-system]]

Renders a tooltip row for vessel activity or detection positions on the map, displaying vessel identity, timestamp, thumbnails, and search options.

- PositionsTooltipRowProps · type · L45-L52 — Type definition for the props passed to the PositionsTooltipRow component, specifying loading state, error messages, feature data, and UI interaction callbacks.
- getThumbnailBand · function · L55-L59 — Extracts the image band identifier (e.g., RGB, NIR) from a detection thumbnail filename.
- isRGBThumbnail · function · L61-L61 — Determines whether a thumbnail image is an RGB band by checking if its extracted band identifier equals RGB.
- DetectionThumbnails · function · L63-L112 — React component that displays detection thumbnail images with a band selector, defaulting to RGB and allowing users to switch between available spectral bands.
- PositionsTooltipRow · function · L114-L317 — Main React component that renders a tooltip row for a map position, displaying vessel information, timestamps, vessel pins, search links, and detection thumbnails with state management and real-time data handling.
- renderShipname · function · L185-L221 — Renders the vessel name or MMSI, handling cases of fake names for debugging, real-time vessel identity resolution, and unmatched positions.
- renderVesselPin · function · L223-L245 — Renders a vessel pin indicator showing the vessel's location, conditionally displaying loading state, real-time vessel info, or matched position data.
- renderSearchLink · function · L247-L273 — Renders a search link that directs users to the advanced vessel search when a real-time position cannot be matched to a single vessel identity.
