# apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx · [[dataview-and-dataset-loading-integration]] [[map-viewport-and-timebar-integration]] [[router-state-and-navigation]] [[workspaces-list-ui-components]]

A React component that provides an interactive wizard for users to search and navigate to marine manager workspaces by selecting ocean areas (EEZ, MPA, FAO, or RFMO regions).

- getItemLabel · function · L54-L59 — Formats an ocean area object into a display string combining the area name with its translated type label.
- WorkspaceWizard · function · L61-L274 — Main React component that renders a workspace wizard interface with ocean area search, map navigation, and links to explore specific areas or generate reports.
- updateMatchingAreas · function · L73-L85 — Searches the ocean areas database by user query and locale, populating the autocomplete dropdown with matching results limited to the maximum display count.
- onInputChange · function · L87-L96 — Handles input field changes by clearing selections or triggering a new area search, and resets the map to world view when input is cleared.
- onSelectResult · function · L98-L106 — Records an analytics event when the user selects an ocean area from the dropdown and updates the selected item state.
- onSearchClick · function · L108-L115 — Fits the map view to the bounds of the selected ocean area when the search button is clicked.
- onHighlightedIndexChange · function · L117-L123 — Pans the map to fit the bounds of the highlighted dropdown item as the user navigates through search results.
- fetchMarineManagerData · function · L126-L135 — Fetches marine manager dataviews and their associated datasets on component mount to populate the workspace configuration.
- onInputBlur · function · L149-L154 — Clears the selected item and autocomplete results if the user blurs the input without confirming a valid selection.
