# apps/platform/features/_map/map/LayersComposer.tsx · [[map-rendering-core]]

Module that composes and manages map layers and highlight synchronization outside the DeckGL rendering context to optimize performance.

- LayersComposer · function · L6-L10 — Component that orchestrates layer composition and hover updates independently to prevent pointer movement from triggering DeckGL prop rebuilds.
