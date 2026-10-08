# GFW map query params (state)

Pass these unabbreviated in `state` — the encoder abbreviates them.
Source of truth (params documented with JSDoc — read these when a param is missing here):
`apps/platform/types/index.ts` (`WorkspaceState`/`AppState`/`QueryParams`), `apps/platform/features/_reports/reports.types.ts` (`ReportState`), `apps/platform/features/_vessels/vessel/vessel.types.ts` (`VesselProfileState`), `apps/platform/features/_vessels/search/search.types.ts` (`VesselSearchState`).
Defaults live in `DEFAULT_WORKSPACE` (`apps/platform/data/map/config.ts`) and `DEFAULT_REPORT_STATE` (`features/_reports/reports.config.ts`).

## Core (all routes)

| Param                           | Type                            | Notes                                                                                                                           |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `latitude`, `longitude`, `zoom` | number                          | Viewport. zoom 0 = world, ~4-6 = country, ~12 = port                                                                            |
| `start`, `end`                  | ISO datetime                    | Time range, e.g. `2026-07-01T00:00:00.000Z`. `end` is exclusive: year 2025 → `end=2026-01-01T00:00:00.000Z`                     |
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

| Param                                                                                 | Values                                                                                                                                                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reportCategory`                                                                      | `activity` (default) \| `detections` \| `events` \| `environment` \| `others` \| `vessel-groups`                                                                           |
| `reportActivitySubCategory`                                                           | `fishing` \| `presence` — sub-filter within an activity report                                                                                                             |
| `reportDetectionsSubCategory`                                                         | `sar` \| `viirs` \| `sentinel-2` — sub-filter within a detections report                                                                                                   |
| `reportEventsSubCategory`                                                             | event type within an events report: `encounter` (default) \| `loitering` \| `port_visit` \| `gap`                                                                          |
| `reportVesselsSubCategory`                                                            | vessels-tab sub-tab: `flag` (default) \| `geartype` \| `vesselType` \| `source` \| `coverage`                                                                              |
| `reportActivityGraph`                                                                 | `evolution` (default) \| `beforeAfter` \| `periodComparison` \| `datasetComparison`                                                                                        |
| `reportTimeComparison`                                                                | `{ "start", "compareStart", "duration", "durationType": "days"\|"months" }` — for `beforeAfter`/`periodComparison`                                                         |
| `reportComparisonDataviewIds`                                                         | `{ "main", "compare" }` dataview ids — for `datasetComparison`                                                                                                             |
| `reportVesselGraph`                                                                   | `flag` (default) \| `geartype` \| `vesselType`                                                                                                                             |
| `reportBufferValue` / `reportBufferUnit` / `reportBufferOperation`                    | number / `nauticalmiles`\|`kilometers` / `dissolve`\|`difference`                                                                                                          |
| `reportVesselFilter`                                                                  | free-text filter on the vessels list — see syntax below                                                                                                                    |
| `reportVesselPage`, `reportResultsPerPage`                                            | pagination (page is 0-based; per-page min 10, max 50, default 10)                                                                                                          |
| `reportVesselOrderProperty` / `reportVesselOrderDirection`                            | sort: `shipname` (default) \| `flag` \| `shiptype` / `asc` (default) \| `desc`                                                                                             |
| `reportLoadVessels`                                                                   | boolean, load vessel list immediately. REQUIRED `true` with `reportVesselFilter`, `reportVesselGraph` or a grouped `reportEventsGraph` (`byFlag`/`byRFMO`/`byFAO`/`byEEZ`) |
| `reportEventsGraph`                                                                   | events-report chart: `evolution` (default) \| `byFlag` \| `byRFMO` \| `byFAO` \| `byEEZ`                                                                                   |
| `reportEventsPortsFilter`, `reportEventsPortsPage`, `reportEventsPortsResultsPerPage` | ports list controls in an events report (same semantics as the vessel-table ones)                                                                                          |

Note: the URL param is `reportResultsPerPage` even though the app state field is named `reportVesselResultsPerPage` — always use `reportResultsPerPage` in `state`.

`reportVesselFilter` syntax (also `reportEventsPortsFilter`): `<field>:<value>`, fields `name`, `flag`, `mmsi`, `gear` (gear type), `type` (gear or vessel type), `source`; comma = search by multiple fields, `|` = OR, leading `-` = exclude. `gear:` and `type:` match the label shown in the vessel table EXACTLY (case-insensitive), never the API id: `gear:Purse seine` (not `purse_seines`), `gear:Trawler`, `gear:Drifting longline`, `gear:Set longline`, `gear:Squid jigger`, `gear:Tuna purse seine`, `gear:Pole and line`, `gear:Pots and traps` (labels from the app's `vessel.gearTypes` translations: singular, first word capitalized). `name:`/`flag:`/`mmsi:` match by "contains". E.g. `flag:china, gear:trawler`, `-spain`, `cargo|passenger`.

"Search / filter the report vessels for X" → stay on (or open) the report and set `reportVesselFilter` + `reportLoadVessels: true` (+ `reportVesselGraph: "geartype"` for gear, `"flag"` for flags). It is not a `vessel-search`.

### Time comparison

`reportActivityGraph: "periodComparison"` (two periods of equal length, e.g. "2023 vs 2024", "this summer vs last summer") or `"beforeAfter"` (around a pivot date, e.g. "3 months before and after June 1st 2023"), with:

- `reportTimeComparison.start` = start of the EARLIER (baseline) period; `compareStart` = start of the LATER period. `compareStart` must be after `start` or the app shows "Comparison start must be after baseline start".
- `beforeAfter`: `compareStart` = the pivot date, `start` = pivot minus `duration`.
- `duration` + `durationType`: `months` (max 12) or `days` (max 100).
- Top-level `start`/`end` cover both periods (from `reportTimeComparison.start` to `compareStart` + duration).
- Every visible AIS fishing-effort layer (`ais`, `fishing-effort-ais__*`) sets `"distance_from_port_km": ""` in `config.filters`: the comparison requires the same filters on every dataset and the dataview default breaks it.

"This summer vs last summer" (now 2026-10): `{ "start": "2025-06-01", "compareStart": "2026-06-01", "duration": 3, "durationType": "months" }`, `start: 2025-06-01T00:00:00.000Z`, `end: 2026-09-01T00:00:00.000Z`.

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

**Their names are inverted vs the UI labels** (source: `SearchAdvancedFilters.tsx`):

- `transmissionDateTo` = **"Active after"** — vessel still transmitting on/after this date.
- `transmissionDateFrom` = **"Active before"** — vessel already transmitting on/before this date.
- "Transmitted during 2023" → `transmissionDateTo: "2023-01-01"`, `transmissionDateFrom: "2023-12-31"`. When both are set `transmissionDateFrom` must be later than `transmissionDateTo`, else "The ACTIVE BEFORE date must come after the ACTIVE AFTER date".

Search needs a real criterion: transmission dates, `sources` and `infoSource` alone never run a search. Basic search needs a `query` of 3+ characters; advanced needs a `query` or another field (`flag`, `geartypes`, `shiptypes`, `owner`, `ssvid`, `imo`, `callsign`). Without one, ask the user for it (name, flag, gear type…) before navigating.

## User page (`user` route)

`userTab`: `info` (profile + the user groups they belong to) | `workspaces` | `datasets` | `reports` | `vesselGroups` (see / create vessel groups).

<!-- Maintainers: every enumerated value above maps to a source symbol — see "Value sources" in ../MAINTENANCE.md for update checks. -->
