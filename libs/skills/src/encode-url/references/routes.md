# GFW platform routes

App served under basename `/platform` (already included in the script's `path` output).
Source: `apps/platform/routes/_platform` (TanStack Router file routes), patterns in `ROUTE_PATHS` (`apps/platform/config/routes.ts`).

Map views live under a `/map` segment. The vessel profile, vessel search, saved report and user pages are also reachable standalone, without `/map` — omit `category`/`workspaceId` to get those.

| Route type                   | Path pattern                                                              | Path params             | When to use                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `workspace`                  | `/platform/map` (default — omit `category`/`workspaceId`)                 | —                       | Browse/compare layers on the map                                                                    |
| `workspace` (curated)        | `/platform/map/$category/$workspaceId`                                    | category, workspaceId   | Link-only, see highlighted-workspaces.md — never add state on top                                   |
| `workspaces-list`            | `/platform/map/$category`                                                 | category                | Index of curated public workspaces of a category ("marine manager workspaces") — not the user's own |
| `report`                     | `/platform/map/$category/$workspaceId/report/$datasetId/$areaId`          | + datasetId, areaId     | Aggregated report over an area (EEZ/FAO/RFMO/MPA)                                                   |
| `report` (global)            | `/platform/map/$category/$workspaceId/report`                             | — (no datasetId/areaId) | Whole-world aggregated report; omit `datasetId`+`areaId`, category defaults to `reports`            |
| `report` (saved)             | `/platform/report/$reportId`                                              | reportId                | Open a user-saved report                                                                            |
| `vessel` (standalone)        | `/platform/vessel/$vesselId` (default — omit `category`/`workspaceId`)    | vesselId                | Vessel profile on its own (identity, track, events)                                                 |
| `vessel`                     | `/platform/map/$category/$workspaceId/vessel/$vesselId`                   | + vesselId              | Vessel profile opened over a workspace (only when modifying a URL that already has one)             |
| `vessel-search` (standalone) | `/platform/vessel-search` (default — omit `category`/`workspaceId`)       | —                       | Search vessels by name/MMSI/IMO or advanced filters                                                 |
| `vessel-search`              | `/platform/map/$category/$workspaceId/vessel-search`                      | category, workspaceId   | Search vessels from within a workspace (only when modifying a URL that already has one)             |
| `vessel-group-report`        | `/platform/map/$category/$workspaceId/vessel-group-report/$vesselGroupId` | + vesselGroupId         | Report over a vessel group                                                                          |
| `ports-report`               | `/platform/map/$category/$workspaceId/ports-report/$portId`               | + portId                | Port activity profile (visits, vessels)                                                             |
| `user`                       | `/platform/user`                                                          | —                       | The user's own content, one `userTab` per topic (below)                                             |

- `category`: `fishing-activity` (default for reports) | `reports` (global report) | `marine-manager` (curated, link-only)
- `workspaceId`: `default-public` (default public workspace)
- report `datasetId` values: `public-eez-areas`, `public-fao-major`, `public-rfmo`, `public-mpa-all`, `public-high-seas` (single area, `areaId` `63203`)
- `areaId`: grep `areas/<eez|fao|rfmo|mpa>.json` — numeric for EEZs and MPAs (WDPA id), FAO major area code (`41`), RFMO acronym (`ICCAT`)
- `vesselId`: GFW vessel id (uuid-like, from vessel search results)
- `portId`: e.g. `arg-camarones` (see `ports.json`)

## Ports report

"Show / find / report the port of X" → `ports-report`. The events only load when the `port-visits` layer is visible AND filtered to the port — the same config the app's own port links write:

```json
{
  "route": { "type": "ports-report", "portId": "esp-vigo" },
  "state": {
    "dataviewInstances": [
      { "id": "basemap", "config": { "basemap": "satellite" } },
      {
        "id": "port-visits",
        "config": {
          "visible": true,
          "clusterMaxZoomLevels": { "default": 20 },
          "filters": { "port_id": "esp-vigo" }
        }
      },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "reportCategory": "events",
    "timebarVisualisation": "events",
    "portsReportName": "VIGO",
    "portsReportCountry": "ESP",
    "portsReportDatasetId": "public-global-port-visits-events:v4.0",
    "start": "2026-01-01T00:00:00.000Z",
    "end": "2026-10-01T00:00:00.000Z"
  }
}
```

`portId`, `portsReportName` (uppercase) and `portsReportCountry` come from `ports.json` / `search_ports` (`id`, `name`, `flag`).

Known encoder bug (≤ 0.0.12): it rejects `port_id` ("not supported by any of its datasets"). If so, retry once without `filters.port_id`, keeping the rest of the config.

## User page tabs

`userTab`: `info` (profile and the user groups they belong to) | `workspaces` (saved workspaces) | `datasets` (uploaded datasets) | `reports` (saved reports) | `vesselGroups` (vessel groups: view, create, add vessels to one).

Legacy paths `/platform/map/user`, `/platform/map/vessel-search`, `/platform/map/report/$reportId` and `/platform/map/vessel/$vesselId` are 308-redirected by the app to the standalone equivalents. The decoder still recognises them, but never build new URLs with them.
