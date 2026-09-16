# apps/platform/routes/api/ocean-areas/name.ts · [[ocean-areas-api]]

API route handler for retrieving ocean area names at specified coordinates with optional locale and EEZ combination.

- GetOceanAreaNameRequest · type · L5-L11 — Request payload shape defining required coordinates and zoom level with optional locale and EEZ inclusion flag for ocean area name lookup.
- GetOceanAreaNameResponse · type · L13-L17 — Response payload shape indicating success status, descriptive message, and optional retrieved ocean area name data.
