# Maintaining the encode-url skill

Not loaded at skill runtime — this is the prompt/checklist for keeping the skill docs in sync with the app. Run it after changes to the platform state types, URL encoding, or dataview/layer config.

## Update prompt

Paste (or point Claude at) the following:

> Sync the `encode-url` skill docs (`libs/skills/src/encode-url/`) with the app source. Requirements:
>
> 1. **Diff params against the documented types.** The four source-of-truth files carry JSDoc on every state field, all under `apps/platform/`: `types/index.ts` (`WorkspaceState`/`AppState`/`QueryParams`), `features/_reports/reports.types.ts`, `features/_vessels/vessel/vessel.types.ts`, `features/_vessels/search/search.types.ts`. Compare against `references/query-params.md`; add new intent-useful params, remove deleted ones.
> 2. **Diff every enumerated value.** The "Value sources (for update checks)" table in `libs/skills/src/encode-url/MAINTENANCE.md` maps each param to the exact symbol and file its values were copied from. Read each symbol; diff its values against the doc tables in `references/query-params.md`; fix drift. Add a row for any newly documented enum param.
> 3. **Coverage policy: curated, not exhaustive.** Document params a URL-building intent can actually use. Internal/auto-generated params stay out of the tables and go in the "never set" footnote near the top of `references/query-params.md` — that footnote is the authoritative list; keep it current instead of documenting those params.
> 4. **URL param names, not state field names.** A `state` param must match a key in `PARAMS_TO_ABBREVIATED` (`libs/dataviews-client/src/url-workspace/url-workspace.ts`) or serialize under its full name. Known trap: URL param `reportResultsPerPage` vs type field `reportVesselResultsPerPage`. Advanced search fields (`transmissionDateFrom/To`, from `ADVANCED_SEARCH_QUERY_FIELDS` in `libs/api-client/src/utils/search.ts`) are a different namespace from `firstTransmissionDate`/`lastTransmissionDate` (`fTD`/`lTD`).
> 5. **Layer/instance ids** come from `apps/platform/config/map/workspaces.ts` constants and must resolve in the encoder dictionary `libs/skills/src/encode-url/dictionary.ts` (known trap: the FAO context instance is `context-layer-fao-areas`, not `context-layer-fao`).
> 6. **Defaults** come from `DEFAULT_WORKSPACE` (`apps/platform/data/map/config.ts`) and `DEFAULT_REPORT_STATE` (`apps/platform/features/_reports/reports.config.ts`) — mark them `(default)` in the tables.
> 7. **Routes come from `ROUTE_PATHS`** (`apps/platform/config/routes.ts`) and the basename from `DEFAULT_PATH_BASENAME` in the same file. `routes.ts` (`ROUTE_PATTERNS`, `LEGACY_ROUTE_PATTERNS`) must cover every pattern an agent can build or decode, and `references/routes.md` must show the full patterns including the `/map` segment. Redirect-only paths (`apps/platform/routes/_platform/_map/map/{user,vessel-search,report.$reportId,vessel.$vesselId}.tsx`) belong in `LEGACY_ROUTE_PATTERNS` for decoding only, never in the build tables.
> 8. **Examples live in two files.** `references/examples.md` holds input recipes; `references/examples-conversations.md` holds conversation transcripts with expected output URLs. Update transcripts if encoder output changes.
> 9. **Verify, don't trust.** `pnpm nx dist skills`, then run `node scripts/encode-url.mjs` (node >= 23) with inputs exercising every param you touched; confirm expected abbreviations/pass-through names in the output path. Round-trip against the transcripts in examples-conversations.md. Finish with `pnpm prettier --write` on every markdown file touched.

## Value sources (for update checks)

Every enumerated value in `references/query-params.md` is copied from one of these symbols. To check for updates: read each symbol and diff its values against the tables in that file. This table lives here (not in the reference) to keep skill-runtime token cost down.

| Param(s)                                                                               | Symbol                                                                                                                                                             | File                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `timebarVisualisation`                                                                 | `TimebarVisualisations` enum                                                                                                                                       | `apps/platform/types/index.ts`                              |
| `timebarGraph`                                                                         | `TimebarGraphs` enum                                                                                                                                               | `apps/platform/types/index.ts`                              |
| `visibleEvents`                                                                        | `EventTypes` enum (app toggles use `Gaps = 'gaps'`, not `Gap`)                                                                                                     | `libs/api-types/src/events.ts`                              |
| `activityVisualizationMode`, `detectionsVisualizationMode`                             | `FOURWINGS_VISUALIZATION_MODES`                                                                                                                                    | `libs/deck-layers/src/layers/fourwings/fourwings.config.ts` |
| `environmentVisualizationMode`                                                         | `HEATMAP_ID`, `HEATMAP_LOW_RES_ID`                                                                                                                                 | `libs/deck-layers/src/layers/fourwings/fourwings.config.ts` |
| `vesselGroupsVisualizationMode`                                                        | `FOOTPRINT_ID`, `FOOTPRINT_HIGH_RES_ID`                                                                                                                            | `libs/deck-layers/src/layers/fourwings/fourwings.config.ts` |
| `vesselsColorBy`                                                                       | `VesselsColorByProperty`                                                                                                                                           | `libs/deck-layers/src/layers/vessel/vessel.config.ts`       |
| `mapDrawing`                                                                           | `DrawFeatureType`                                                                                                                                                  | `libs/deck-layers/src/layers/draw/DrawLayer.ts`             |
| `colorRamp`/`color` palette                                                            | `FILL_COLOR_BAR_OPTIONS`                                                                                                                                           | `libs/ui-components/src/color-bar/color-bar-options.ts`     |
| `reportCategory`                                                                       | `ReportCategory` enum                                                                                                                                              | `apps/platform/features/_reports/reports.types.ts`          |
| `reportActivitySubCategory`, `reportDetectionsSubCategory`, `reportVesselsSubCategory` | `ReportActivitySubCategory`, `ReportDetectionsSubCategory`, `ReportVesselsSubCategory` types (built on `DatasetSubCategory` from `libs/api-types/src/datasets.ts`) | `apps/platform/features/_reports/reports.types.ts`          |
| `reportEventsSubCategory`                                                              | `EventType` (= `EventTypes` values)                                                                                                                                | `libs/api-types/src/events.ts`                              |
| `reportActivityGraph`                                                                  | `REPORT_ACTIVITY_GRAPH_*` consts                                                                                                                                   | `apps/platform/features/_reports/reports.config.ts`         |
| `reportEventsGraph`                                                                    | `REPORT_EVENTS_GRAPH_*` consts                                                                                                                                     | `apps/platform/features/_reports/reports.config.ts`         |
| `reportVesselGraph`                                                                    | `REPORT_VESSELS_GRAPH_*` consts                                                                                                                                    | `apps/platform/features/_reports/reports.config.ts`         |
| `reportVesselOrderProperty`/`Direction`                                                | `REPORT_VESSEL_ORDER_PROPERTIES`, `REPORT_VESSEL_ORDER_DIRECTIONS`                                                                                                 | `apps/platform/features/_reports/reports.types.ts`          |
| `reportBufferUnit`, `reportBufferOperation`                                            | `BUFFER_UNITS`, `BUFFER_OPERATIONS`                                                                                                                                | `apps/platform/types/index.ts`                              |
| `vesselSection`, `vesselArea`, `vesselRelated`, `vesselActivityMode`                   | `VESSEL_SECTIONS`, `VESSEL_AREA_SUBSECTIONS`, `VESSEL_RELATED_SUBSECTIONS`, `VESSEL_PROFILE_ACTIVITY_MODES`                                                        | `apps/platform/features/_vessels/vessel/vessel.types.ts`    |
| advanced search fields                                                                 | `ADVANCED_SEARCH_QUERY_FIELDS`                                                                                                                                     | `libs/api-client/src/utils/search.ts`                       |
| `userTab`                                                                              | `UserTab` enum                                                                                                                                                     | `apps/platform/types/index.ts`                              |
| URL param abbreviations                                                                | `PARAMS_TO_ABBREVIATED` (params NOT listed there serialize under their full name)                                                                                  | `libs/dataviews-client/src/url-workspace/url-workspace.ts`  |

## Encoder-enforced invariants

`encode.ts` injects these automatically — keep them OUT of SKILL.md workflow rules (agents must not add them by hand), and keep the transforms in sync with app behavior:

- Area `report` routes get the context layer matching each `datasetId` (`AREA_DATASET_CONTEXT_LAYER` map) unless an instance already resolves to that dataview.
- AIS apparent-fishing-effort instances with a non-empty `config.filters` get `distance_from_port_km: "3"` added unless the key is present (URL filters replace dataview defaults; filterless instances keep the server-side default).
- Layer-library instance ids get `dataviewId` filled from `dictionary.ts`; `{PIPE_DATASET_VERSION}` tokens resolve from the env.
- `start`/`end` snap to the fourwings interval resolution.

## Doc structure invariants

- Each reference file's header names its source-of-truth files.
- The "Value sources" table above stays current — symbol + file, no line numbers (they rot). It lives in MAINTENANCE.md, not in the references, to avoid skill-runtime token cost.
- SKILL.md points agents at the typed JSDoc for params not covered in query-params.md.
- Format touched markdown with `pnpm prettier --write`.
