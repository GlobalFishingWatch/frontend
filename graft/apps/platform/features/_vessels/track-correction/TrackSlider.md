# apps/platform/features/_vessels/track-correction/TrackSlider.tsx · [[map-aware-time-selection]] [[track-correction-feature]]

Provides a time-range slider component for selecting and visualizing track segments within a vessel's movement timeline.

- SegmentsTimelineProps · type · L20-L26 — Type definition extending TrackSliderProps with optional canvas rendering properties and selected time range bounds for the timeline visualization.
- TrackSegmentsTimeline · function · L28-L103 — Renders a canvas-based timeline visualization of track segments with color-coded points indicating whether each position falls within the user's selected time range.
- TrackSliderProps · type · L105-L111 — Type definition specifying the props accepted by the TrackSlider component including segments, styling, time range bounds, and optional callback handler.
- TrackSlider · function · L113-L235 — Interactive dual-thumb slider component that snaps to nearest track points and dispatches selected time range corrections to Redux state.
