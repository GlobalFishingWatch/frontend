# apps/platform/types/index.ts · [[application-type-definitions]]

Type definitions and enums for workspace state, app state, and map UI configuration in the platform application.

- WorkspaceViewportParam · type · L27-L27 — Defines the three coordinate parameters required to specify a map viewport position.
- WorkspaceTimeRangeParam · type · L28-L28 — Defines the time interval parameters for filtering data in the workspace.
- BufferUnit · type · L30-L30 — Specifies distance units available for buffer operations around geometric features.
- BufferOperation · type · L32-L32 — Defines the geometric operations available when creating buffers around user-drawn features.
- WorkspaceStateProperty · type · L34-L34 — Constrains state property access to only the keys defined within the WorkspaceState interface.
- AppStateProperty · type · L35-L35 — Constrains state property access to only the keys defined within the AppState type.
- AnyStateProperty · type · L37-L37 — Union of all valid state property keys from both workspace and application state.
- WorkspaceParam · type · L39-L45 — Encompasses all URL-serializable parameters that can configure workspace state including viewport, time range, reports, vessels, and events.
- WorkspaceViewport · type · L47-L47 — Defines the numeric values for latitude, longitude, and zoom level that position and scale the map view.
- WorkspaceTimeRange · type · L48-L48 — Specifies the start and end date strings that define the temporal bounds for displayed data.
- BivariateDataviews · type · L50-L50 — Represents an optional pair of dataview identifiers used for two-color heatmap comparison visualization.
- TimeMode · type · L52-L52 — Distinguishes between historical data analysis and real-time data monitoring modes.
- WorkspaceState · interface · L56-L123 — Comprehensive configuration state for the workspace including map visualization modes, layers, annotations, timebar settings, and feature toggles.
- AnyWorkspaceState · type · L125-L125 — Flexible union allowing any combination of workspace, report, and vessel profile state properties to be partially specified.
- RedirectParam · type · L127-L130 — Optional parameters for handling redirect behavior and authentication token passing during navigation.
- UserTab · enum · L132-L143 — Enumerates the sections of the user profile panel (info, workspaces, datasets, reports, vessel groups).
- SidePanelContent · type · L145-L155 — Specifies the available content types that can be displayed in the informational side panel (guides, datasets, terminology, chat).
- TrackCorrectionId · type · L162-L162 — Identifier for track corrections, distinguishing between newly created corrections and existing ones.
- AppState · type · L165-L183 — Holds UI state for the application including active user tab, drawing mode, selected panels, and feature correction IDs.
- QueryParams · type · L185-L192 — Comprehensive union of all URL query parameter types enabling serialization of complete workspace and app state to the URL.
- QueryParam · type · L194-L194 — Represents any single key that can be stored as a URL query parameter in the application.
- TimebarVisualisations · enum · L196-L204 — Enumerates the visualization types available in the time-series bar (heatmaps, events, vessel track, environment, points).
- TimebarVisualisation · type · L205-L205 — Type-safe reference to any single TimebarVisualisations enum value representing the currently displayed visualization.
- VisibleEvents · type · L207-L207 — Specifies which event types are rendered on the map and timebar, either as a filtered list or special 'all'/'none' keywords.
- TimebarGraphs · enum · L209-L213 — Enumerates secondary graph overlay options on the timebar for displaying vessel speed, depth, or none.
- Bbox · type · L216-L216 — Represents a geographic bounding box as a tuple of minimum and maximum X and Y coordinates.
- MapCoordinates · type · L218-L222 — Combines latitude, longitude, and zoom level into a single object representing a map camera position.
