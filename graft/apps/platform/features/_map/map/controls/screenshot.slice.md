# apps/platform/features/_map/map/controls/screenshot.slice.ts · [[screenshot-configuration]]

Redux slice managing screenshot area selection with persistent local storage integration for the map feature.

- ScrenshotArea · type · L11-L11 — Type union for the three screenshot capture area options: map-only, with timebar, or with timebar and legend.
- ScrenshotDOMArea · type · L12-L13 — Type union representing the DOM element IDs that correspond to each screenshot area.
- ScreenshotState · interface · L24-L26 — Redux state shape holding the currently selected screenshot area DOM ID.
- getInitialState · function · L28-L38 — Initializes screenshot state from localStorage with fallback to default area when storage is unavailable or corrupted.
- LazyLoadedSlices · interface · L63-L63 — Module augmentation interface that registers the screenshot slice with the root reducer's lazy-loaded slices.
