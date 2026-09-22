# apps/image-labeler/src/api/base.ts · [[image-labeler-redux-api-layer]] [[redux-toolkit-query-api-abstraction-pattern]]

Module that exports a Redux Toolkit Query base query function for the Global Fishing Watch API.

- gfwBaseQuery · function · L6-L33 — Factory function that creates a Redux Toolkit Query base query handler, wrapping GFWAPI.fetch with error parsing and standardized response/error formatting.
