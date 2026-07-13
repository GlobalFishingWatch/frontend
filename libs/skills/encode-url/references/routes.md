# GFW map routes

App served under basename `/map` (already included in the script's `path` output).
Source: `apps/fishing-map/routes/_app` (TanStack Router file routes).

| Route type            | Path pattern                                                 | Path params           | When to use                                                                          |
| --------------------- | ------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------ |
| `workspace`           | `/` or `/$category/$workspaceId`                             | category, workspaceId | Browse/compare layers on the map                                                     |
| `workspaces-list`     | `/$category`                                                 | category              | List curated workspaces of a category                                                |
| `report`              | `/$category/$workspaceId/report/$datasetId/$areaId`          | + datasetId, areaId   | Aggregated report over an area (EEZ/FAO/RFMO/MPA)                                    |
| `report` (global)     | `/$category/$workspaceId/report`                             | — (no datasetId/areaId) | Whole-world aggregated report; omit `datasetId`+`areaId`, category defaults to `reports` |
| `report` (saved)      | `/report/$reportId`                                          | reportId              | Open a user-saved report                                                             |
| `vessel`              | `/$category/$workspaceId/vessel/$vesselId`                   | + vesselId            | Vessel profile (identity, track, events)                                             |
| `vessel-search`       | `/$category/$workspaceId/vessel-search`                      | —                     | Search vessels by name/MMSI/IMO or advanced filters                                  |
| `vessel-group-report` | `/$category/$workspaceId/vessel-group-report/$vesselGroupId` | + vesselGroupId       | Report over a vessel group                                                           |
| `ports-report`        | `/$category/$workspaceId/ports-report/$portId`               | + portId              | Port activity profile (visits, vessels)                                              |
| `user`                | `/user`                                                      | —                     | User info, saved workspaces (`userTab=workspaces`), datasets, reports, vessel groups |

- `category`: `fishing-activity` (default) | `marine-manager` | `reports`
- `workspaceId`: `default-public` (default public workspace)
- report `datasetId` values: `public-eez-areas`, `public-fao-major`, `public-rfmo`, `public-mpa-all`
- `areaId`: numeric for EEZs (see `areas.json`), FAO major area code, RFMO id
- `vesselId`: GFW vessel id (uuid-like, from vessel search results)
- `portId`: e.g. `arg-camarones` (see `ports.json`)
