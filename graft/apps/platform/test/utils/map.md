# apps/platform/test/utils/map.ts · [[map-browser-test-utilities]]

Test utility module providing map interaction helpers and wait functions for integration testing map components and vessel tracking features.

- MapTestId · type · L15-L15 — Type alias for the getByTestId query function from the test render environment.
- waitForMapLoaded · function · L17-L22 — Waits for the map loading spinner to disappear, indicating the map has finished rendering.
- waitForMapInstance · function · L24-L31 — Polls the Jotai store until the map instance atom is defined and available.
- waitForMapViewport · function · L33-L48 — Waits for both the map instance and the specific viewport with MAP_VIEW_ID to be ready for use.
- waitForMapSpinnerHidden · function · L50-L52 — Waits for the map loading spinner element to become hidden from view.
- waitForVesselTrackReady · function · L55-L59 — Ensures vessel track tiles are fully rendered on the map before proceeding with test interactions.
- clickMapAtCoordinates · function · L61-L94 — Simulates a user hover and click at specified geographic coordinates on the map element.
- openVesselOnMap · function · L96-L117 — Opens a vessel on the map by waiting for readiness and clicking at configured or default Gabu Reefer coordinates.
