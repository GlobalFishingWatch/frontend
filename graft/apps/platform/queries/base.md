# apps/platform/queries/base.ts · [[data-query-api-integration]]

Module providing base query utilities and configuration for Redux Toolkit Query integration with the Global Fishing Watch API.

- getQueryParamsResolved · function · L7-L9 — Converts a params object into a URL query string with array indices format and query prefix.
- gfwBaseQuery · function · L11-L39 — Creates a Redux Toolkit Query base query function that wraps GFWAPI.fetch to handle request execution and error parsing.
