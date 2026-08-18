# GFW platform routes

App served under basename `/platform` (already included in the script's `path` output).
Source: `apps/platform/routes/_platform` (TanStack Router file routes), patterns in `ROUTE_PATHS` (`apps/platform/config/routes.ts`).

Map views live under a `/map` segment. The vessel profile, vessel search, saved report and user pages are also reachable standalone, without `/map` — omit `category`/`workspaceId` to get those.

| Route type                   | Path pattern                                                     | Path params             | When to use                                                                              |
| ---------------------------- | ---------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `workspace`                  | `/map` or `/map/$category/$workspaceId`                          | category, workspaceId   | Browse/compare layers on the map                                                         |
| `workspaces-list`            | `/map/$category`                                                 | category                | List curated workspaces of a category                                                    |
| `report`                     | `/map/$category/$workspaceId/report/$datasetId/$areaId`          | + datasetId, areaId     | Aggregated report over an area (EEZ/FAO/RFMO/MPA)                                        |
| `report` (global)            | `/map/$category/$workspaceId/report`                             | — (no datasetId/areaId) | Whole-world aggregated report; omit `datasetId`+`areaId`, category defaults to `reports` |
| `report` (saved)             | `/report/$reportId`                                              | reportId                | Open a user-saved report                                                                 |
| `vessel`                     | `/map/$category/$workspaceId/vessel/$vesselId`                   | + vesselId              | Vessel profile opened over a workspace (keeps the map state)                             |
| `vessel` (standalone)        | `/vessel/$vesselId`                                              | vesselId                | Vessel profile on its own (identity, track, events)                                      |
| `vessel-search`              | `/map/$category/$workspaceId/vessel-search`                      | category, workspaceId   | Search vessels from within a workspace                                                   |
| `vessel-search` (standalone) | `/vessel-search`                                                 | —                       | Search vessels by name/MMSI/IMO or advanced filters                                      |
| `vessel-group-report`        | `/map/$category/$workspaceId/vessel-group-report/$vesselGroupId` | + vesselGroupId         | Report over a vessel group                                                               |
| `ports-report`               | `/map/$category/$workspaceId/ports-report/$portId`               | + portId                | Port activity profile (visits, vessels)                                                  |
| `user`                       | `/user`                                                          | —                       | User info, saved workspaces (`userTab=workspaces`), datasets, reports, vessel groups     |

- `category`: `fishing-activity` (default) | `marine-manager` | `reports`
- `workspaceId`: `default-public` (default public workspace)
- report `datasetId` values: `public-eez-areas`, `public-fao-major`, `public-rfmo`, `public-mpa-all`
- `areaId`: numeric for EEZs (see `areas.json`), FAO major area code, RFMO id
- `vesselId`: GFW vessel id (uuid-like, from vessel search results)
- `portId`: e.g. `arg-camarones` (see `ports.json`)

Legacy paths `/map/user`, `/map/vessel-search`, `/map/report/$reportId` and `/map/vessel/$vesselId` are 308-redirected by the app to the standalone equivalents. The decoder still recognises them, but never build new URLs with them.
