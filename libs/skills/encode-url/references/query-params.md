# GFW map query params (state)

Pass these unabbreviated in `state` — the encoder abbreviates them.
Source: `apps/fishing-map/types/index.ts` (`WorkspaceParam`, `QueryParams`).

## Core (all routes)

| Param                           | Type                     | Notes                                                                                                 |
| ------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `latitude`, `longitude`, `zoom` | number                   | Viewport. zoom 0 = world, ~4-6 = country, ~12 = port                                                  |
| `start`, `end`                  | ISO datetime             | Time range, e.g. `2026-07-01T00:00:00.000Z`                                                           |
| `dataviewInstances`             | array                    | The layers (see layers.md)                                                                            |
| `timebarVisualisation`          | string                   | `heatmap` (activity) \| `heatmapDetections` \| `events` \| `vessel` \| `vesselGroup` \| `environment` |
| `visibleEvents`                 | array \| `all` \| `none` | Event types on vessel tracks: `fishing`, `encounter`, `port_visit`, `loitering`, `gap`                |
| `timebarGraph`                  | string                   | `speed` \| `elevation` \| `none`                                                                      |
| `sidebarOpen`                   | boolean                  |                                                                                                       |
| `readOnly`                      | boolean                  | Share links that shouldn't be edited                                                                  |
| `daysFromLatest`                | number                   | Rolling window ending at latest available day                                                         |
| `bivariateDataviews`            | [id, id]                 | Two activity layers compared in one bivariate ramp                                                    |
| `mapAnnotations`, `mapRulers`   | arrays                   | Map drawings                                                                                          |

## dataviewInstances item

```json
{
  "id": "ais", // instance id (layers.md)
  "dataviewId": "apparent-fishing-effort-ais-v-{PIPE_DATASET_VERSION}", // only for layers added on top of defaults; version token resolved by the encoder
  "config": {
    "visible": true,
    "color": "#9CA4FF", // set together with colorRamp — use that ramp's hex (see palette below)
    "colorRamp": "lilac", // teal|orange|magenta|yellow|lilac|sky|green|red|salmon
    "filters": { "flag": ["FRA"], "geartype": ["trawlers"] }
  }
}
```

`color`/`colorRamp` are one choice, not two. Pick a ramp and set `color` to its paired hex:

| colorRamp | color     | colorRamp | color     | colorRamp | color     |
| --------- | --------- | --------- | --------- | --------- | --------- |
| teal      | `#00FFBC` | sky       | `#00EEFF` | green     | `#A6FF59` |
| lilac     | `#9CA4FF` | red       | `#FF6854` | orange    | `#FFAA0D` |
| salmon    | `#FFAE9B` | yellow    | `#FFEA00` | magenta   | `#FF64CE` |

To show the SAME dataset twice with different filters (e.g. Spanish vs French fishing), reuse the default instance (`ais`) for one and add a second instance with a unique id (`fishing-effort-ais__<timestamp>`) + `dataviewId`.

## Area report (`report` route)

| Param                                                              | Values                                                                                 |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `reportCategory`                                                   | `activity` \| `detections` \| `events` \| `environment` \| `others` \| `vessel-groups` |
| `reportActivityGraph`                                              | `evolution` \| `beforeAfter` \| `periodComparison`                                     |
| `reportVesselGraph`                                                | `flag` \| `geartype` \| `vesseltype`                                                   |
| `reportBufferValue` / `reportBufferUnit` / `reportBufferOperation` | number / `nauticalmiles`\|`kilometers` / `dissolve`\|`difference`                      |
| `reportVesselFilter`, `reportVesselPage`, `reportResultsPerPage`   | vessel table controls                                                                  |
| `reportLoadVessels`                                                | boolean, load vessel list immediately                                                  |

## Ports report (`ports-report` route)

`portsReportName` (e.g. `CAMARONES`), `portsReportCountry` (ISO3), `portsReportDatasetId` (`public-global-port-visits-events:v4.0`).

## Vessel profile (`vessel` route)

| Param                                       | Values                                                   |
| ------------------------------------------- | -------------------------------------------------------- |
| `vesselDatasetId`                           | `public-global-vessel-identity:v4.0`                     |
| `vesselSelfReportedId` / `vesselRegistryId` | vessel identity ids                                      |
| `vesselIdentitySource`                      | `selfReportedInfo` \| `registryInfo`                     |
| `vesselSection`                             | `activity` \| `related_vessels` \| `areas` \| `insights` |
| `vesselArea`                                | `fao` \| `eez` \| `mpa` \| `rfmo`                        |
| `vesselActivityMode`                        | `voyage` \| `type`                                       |

## Vessel search (`vessel-search` route)

| Param           | Notes                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `query`         | free text: name, MMSI, IMO, callsign                                                                                                   |
| `searchOption`  | `basic` (default) \| `advanced`                                                                                                        |
| advanced fields | `flag` (array ISO3), `owner`, `ssvid` (MMSI), `imo`, `callsign`, `geartypes`, `shiptypes`, `transmissionDateFrom`/`transmissionDateTo` |
| `infoSource`    | identity source filter                                                                                                                 |

## User page (`user` route)

`userTab`: `info` | `workspaces` | `datasets` | `reports` | `vesselGroups`.
