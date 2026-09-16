# apps/platform/features/_vessels/search/search.selectors.ts · [[guest-user-authorization]] [[permission-based-dataset-filtering]] [[vessel-search-system]]

Redux selectors for filtering and retrieving vessel search datasets by type and permissions within a workspace.

- filterDatasetByPermissions · function · L85-L97 — Filters datasets by user permissions for a given search type and user type (guest vs authenticated).
- selectSearchDatasetsInWorkspaceByType · function · L99-L111 — Higher-order selector factory that returns datasets available for a specific search type, filtered by required fields and user permissions.
