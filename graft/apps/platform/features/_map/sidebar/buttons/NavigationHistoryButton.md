# apps/platform/features/_map/sidebar/buttons/NavigationHistoryButton.tsx · [[analytics-integration]] [[map-sidebar-navigation-buttons]] [[router-integration-navigation]]

React component that renders a navigation history button allowing users to return to their previous workspace location while resetting all related panel states.

- NavigationHistoryButton · function · L39-L148 — React component that renders a back button to navigate to the previous workspace location, conditionally showing based on navigation history availability.
- onCloseClick · function · L79-L111 — Handler that clears vessel, report, and workspace state before navigating back, restoring saved map coordinates and timerange from history.
