# GFW map query params (state)

Pass these unabbreviated in `state` — the encoder abbreviates them.
Source of truth (params documented with JSDoc — read these when a param is missing here):
`apps/platform/types/index.ts` (`WorkspaceState`/`AppState`/`QueryParams`), `apps/platform/features/_reports/reports.types.ts` (`ReportState`), `apps/platform/features/_vessels/vessel/vessel.types.ts` (`VesselProfileState`), `apps/platform/features/_vessels/search/search.types.ts` (`VesselSearchState`).
Defaults live in `DEFAULT_WORKSPACE` (`apps/platform/data/map/config.ts`) and `DEFAULT_REPORT_STATE` (`features/_reports/reports.config.ts`).

## Core (all routes)

| Param                           | Type                            | Notes                                                                                                                           |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `latitude`, `longitude`, `zoom` | number                          | Viewport. zoom 0 = world, ~4-6 = country, ~12 = port                                                                            |
| `start`, `end`                  | ISO datetime                    | Time range, e.g. `2026-07-01T00:00:00.000Z`                                                                                     |
| `dataviewInstances`             | array                           | The layers (see layers.md)                                                                                                      |
| `timebarVisualisation`          | string                          | `heatmap` (activity) \| `heatmapDetections` \| `events` \| `vessel` \| `vesselGroup` \| `environment`                           |
| `visibleEvents`                 | array \| `all` \| `none`        | Event types on vessel tracks: `fishing`, `encounter`, `port_visit`, `loitering`, `gaps` (default `all`)                         |
| `timebarGraph`                  | string                          | `speed` \| `elevation` \| `none`                                                                                                |
| `sidebarOpen`                   | boolean                         |                                                                                                                                 |
| `readOnly`                      | boolean                         | Share links that shouldn't be edited                                                                                            |
| `daysFromLatest`                | number                          | Rolling window ending at latest available day                                                                                   |
| `bivariateDataviews`            | [id, id]                        | Two activity layers compared in one bivariate ramp                                                                              |
| `mapAnnotations`, `mapRulers`   | arrays                          | User drawings/measurements; toggle without removing via `mapAnnotationsVisible` / `mapRulersVisible` (booleans, default `true`) |
| `mapDrawing`                    | `polygons` \| `points` \| false | Enables the draw-on-map feature; `mapDrawingEditId` targets an existing drawn feature for edit                                  |
| `activityVisualizationMode`     | string                          | Render mode for activity layers: `heatmap` (default) \| `heatmap-high-res` \| `heatmap-low-res` \| `positions`                  |
| `detectionsVisualizationMode`   | string                          | Same values as activity; for detections layers (default `heatmap`)                                                              |
| `environmentVisualizationMode`  | string                          | `heatmap` \| `heatmap-low-res` (default) — no high res for environment layers                                                   |
| `vesselGroupsVisualizationMode` | string                          | `footprint` (default) \| `footprint-high-res`                                                                                   |
| `vesselsColorBy`                | string                          | Property coloring vessel tracks/points: `track` \| `speed` \| `elevation`                                                       |

Internal/auto-generated params — never set them: `reportAreaBounds`, `skipColorDomainSampling`, `migramarLayer`, `includeRelatedIdentities`, `trackCorrectionId`, `sidePanelId`/`sidePanelSubcontentId`/`sidePanelContent`.

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

| Param                                                                                 | Values                                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `reportCategory`                                                                      | `activity` (default) \| `detections` \| `events` \| `environment` \| `others` \| `vessel-groups`                   |
| `reportActivitySubCategory`                                                           | `fishing` \| `presence` — sub-filter within an activity report                                                     |
| `reportDetectionsSubCategory`                                                         | `sar` \| `viirs` \| `sentinel-2` — sub-filter within a detections report                                           |
| `reportEventsSubCategory`                                                             | event type within an events report: `encounter` (default) \| `loitering` \| `port_visit` \| `gap`                  |
| `reportVesselsSubCategory`                                                            | vessels-tab sub-tab: `flag` (default) \| `geartype` \| `vesselType` \| `source` \| `coverage`                      |
| `reportActivityGraph`                                                                 | `evolution` (default) \| `beforeAfter` \| `periodComparison` \| `datasetComparison`                                |
| `reportTimeComparison`                                                                | `{ "start", "compareStart", "duration", "durationType": "days"\|"months" }` — for `beforeAfter`/`periodComparison` |
| `reportComparisonDataviewIds`                                                         | `{ "main", "compare" }` dataview ids — for `datasetComparison`                                                     |
| `reportVesselGraph`                                                                   | `flag` (default) \| `geartype` \| `vesselType`                                                                     |
| `reportBufferValue` / `reportBufferUnit` / `reportBufferOperation`                    | number / `nauticalmiles`\|`kilometers` / `dissolve`\|`difference`                                                  |
| `reportVesselFilter`                                                                  | free-text filter on the vessels list — see syntax below                                                            |
| `reportVesselPage`, `reportResultsPerPage`                                            | pagination (page is 0-based; per-page min 10, max 50, default 10)                                                  |
| `reportVesselOrderProperty` / `reportVesselOrderDirection`                            | sort: `shipname` (default) \| `flag` \| `shiptype` / `asc` (default) \| `desc`                                     |
| `reportLoadVessels`                                                                   | boolean, load vessel list immediately                                                                              |
| `reportEventsGraph`                                                                   | events-report chart: `evolution` (default) \| `byFlag` \| `byRFMO` \| `byFAO` \| `byEEZ`                           |
| `reportEventsPortsFilter`, `reportEventsPortsPage`, `reportEventsPortsResultsPerPage` | ports list controls in an events report (same semantics as the vessel-table ones)                                  |

Note: the URL param is `reportResultsPerPage` even though the app state field is named `reportVesselResultsPerPage` — always use `reportResultsPerPage` in `state`.

`reportVesselFilter` syntax (also `reportEventsPortsFilter`): comma = search by multiple fields, `|` = OR, leading `-` = exclude. E.g. `flag:china, gear:trawlers`, `-spain`, `cargo|passenger`.

## Ports report (`ports-report` route)

`portsReportName` (e.g. `CAMARONES`), `portsReportCountry` (ISO3), `portsReportDatasetId` (`public-global-port-visits-events:v4.0`).

## Vessel profile (`vessel` route)

| Param                                       | Values                                                          |
| ------------------------------------------- | --------------------------------------------------------------- |
| `vesselDatasetId`                           | `public-global-vessel-identity:v4.0`                            |
| `vesselSelfReportedId` / `vesselRegistryId` | vessel identity ids                                             |
| `vesselIdentitySource`                      | `selfReportedInfo` \| `registryInfo`                            |
| `vesselSection`                             | `activity` \| `related_vessels` \| `areas` \| `insights`        |
| `vesselArea`                                | `fao` \| `eez` \| `mpa` \| `rfmo`                               |
| `vesselRelated`                             | `encounters` \| `owners` — when `vesselSection=related_vessels` |
| `vesselActivityMode`                        | `voyage` \| `type`                                              |

## Vessel search (`vessel-search` route)

| Param           | Notes                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `query`         | free text: name, MMSI, IMO, callsign                                                                                                   |
| `searchOption`  | `basic` (default) \| `advanced`                                                                                                        |
| `sources`       | dataset ids restricting the search (advanced only)                                                                                     |
| advanced fields | `flag` (array ISO3), `owner`, `ssvid` (MMSI), `imo`, `callsign`, `geartypes`, `shiptypes`, `transmissionDateFrom`/`transmissionDateTo` |
| `infoSource`    | identity source filter                                                                                                                 |

`transmissionDateFrom`/`transmissionDateTo` are advanced search FIELDS (dates, `YYYY-MM-DD`) — different namespace from the `firstTransmissionDate`/`lastTransmissionDate` URL params (`fTD`/`lTD`) that always appear (often empty) in search URLs.

## User page (`user` route)

`userTab`: `info` | `workspaces` | `datasets` | `reports` | `vesselGroups`.

<!-- Maintainers: every enumerated value above maps to a source symbol — see "Value sources" in ../MAINTENANCE.md for update checks. -->
