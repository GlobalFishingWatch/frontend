# apps/platform/features/_map/workspace/shared/FitBounds.tsx · [[map-viewport-and-bounds-fitting]]

Provides a fit-bounds button component that adjusts the map viewport and time range when user clicks to focus on a specific layer's data bounds.

- FitBoundsProps · type · L25-L34 — Type definition for the props passed to the FitBounds button component, specifying layer type, visibility constraints, and optional resource metadata.
- useLayerFitBounds · function · L36-L191 — Hook that encapsulates the logic for fitting map bounds based on layer type, handling time-aware bounding boxes and prompting users when data falls outside the current timerange.
- FitBounds · function · L193-L240 — React component that renders a fit-bounds icon button with dynamic tooltips and loading states, delegating the bounds adjustment to the useLayerFitBounds hook.
