# GFW platform routes

App served under basename `/platform` (already included in the script's `path` output).
Source: `apps/platform/routes/_platform` (TanStack Router file routes), patterns in `ROUTE_PATHS` (`apps/platform/config/routes.ts`).

Map views live under a `/map` segment. The vessel profile, vessel search, saved report and user pages are also reachable standalone, without `/map` — omit `category`/`workspaceId` to get those.

| Route type                   | Path pattern                                                              | Path params             | When to use                                                                              |
| ---------------------------- | ------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `workspace`                  | `/platform/map` (default — omit `category`/`workspaceId`)                 | —                       | Browse/compare layers on the map                                                         |
| `workspace` (curated)        | `/platform/map/$category/$workspaceId`                                    | category, workspaceId   | Link-only, see highlighted-workspaces.md — never add state on top                        |
| `workspaces-list`            | `/platform/map/$category`                                                 | category                | List curated workspaces of a category                                                    |
| `report`                     | `/platform/map/$category/$workspaceId/report/$datasetId/$areaId`          | + datasetId, areaId     | Aggregated report over an area (EEZ/FAO/RFMO/MPA)                                        |
| `report` (global)            | `/platform/map/$category/$workspaceId/report`                             | — (no datasetId/areaId) | Whole-world aggregated report; omit `datasetId`+`areaId`, category defaults to `reports` |
| `report` (saved)             | `/platform/report/$reportId`                                              | reportId                | Open a user-saved report                                                                 |
| `vessel` (standalone)        | `/platform/vessel/$vesselId` (default — omit `category`/`workspaceId`)    | vesselId                | Vessel profile on its own (identity, track, events)                                      |
| `vessel`                     | `/platform/map/$category/$workspaceId/vessel/$vesselId`                   | + vesselId              | Vessel profile opened over a workspace (only when modifying a URL that already has one)  |
| `vessel-search` (standalone) | `/platform/vessel-search` (default — omit `category`/`workspaceId`)       | —                       | Search vessels by name/MMSI/IMO or advanced filters                                      |
| `vessel-search`              | `/platform/map/$category/$workspaceId/vessel-search`                      | category, workspaceId   | Search vessels from within a workspace (only when modifying a URL that already has one)  |
| `vessel-group-report`        | `/platform/map/$category/$workspaceId/vessel-group-report/$vesselGroupId` | + vesselGroupId         | Report over a vessel group                                                               |
| `ports-report`               | `/platform/map/$category/$workspaceId/ports-report/$portId`               | + portId                | Port activity profile (visits, vessels)                                                  |
| `user`                       | `/platform/user`                                                          | —                       | User info, saved workspaces (`userTab=workspaces`), datasets, reports, vessel groups     |

- `category`: `fishing-activity` (default for reports) | `reports` (global report) | `marine-manager` (curated, link-only)
- `workspaceId`: `default-public` (default public workspace)
- report `datasetId` values: `public-eez-areas`, `public-fao-major`, `public-rfmo`, `public-mpa-all`
- `areaId`: grep `areas.json` — numeric for EEZs, FAO major area code (`41`), RFMO acronym (`ICCAT`)
- `vesselId`: GFW vessel id (uuid-like, from vessel search results)
- `portId`: e.g. `arg-camarones` (see `ports.json`)

Legacy paths `/platform/map/user`, `/platform/map/vessel-search`, `/platform/map/report/$reportId` and `/platform/map/vessel/$vesselId` are 308-redirected by the app to the standalone equivalents. The decoder still recognises them, but never build new URLs with them.
