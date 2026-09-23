---
name: encode-url
description: Build a GFW map URL (and TanStack Router navigation config) identical to what the platform app itself generates, encoding the full app state — layers, filters, time range, viewport and route. Use when the user wants to see, compare or review ocean activity (fishing effort, vessel presence, detections, encounters, loitering, port visits, environment conditions, etc), open a report over an area or port, open a vessel profile, or search vessels — whether building a view from scratch or modifying the one behind their current URL.
---

# Encode GFW map URL

Turn a navigation intent into `{ navigation, path }`:

- `navigation`: TanStack Router config (`to`, `params`, `search`) — use to navigate from inside the map app.
- `path`: path + encoded query string (e.g. `/platform/map?...`) — for external navigation prepend the origin `https://globalfishingwatch.org`.

Never hand-build the query string: params are abbreviated (`dataviewInstances`→`dvIn`, `config`→`cfg`, `visible`→`vis`…) and repeated values are tokenized (`~0`). The script does this with the app's own encoder:

```bash
node scripts/encode-url.mjs '{"route":{"type":"report","datasetId":"public-eez-areas","areaId":"5682"},"state":{...}}'
# or pipe: echo '<json>' | node scripts/encode-url.mjs
```

Requires node >= 24 (uses `module.registerHooks`). In the monorepo run `pnpm nx build skills` once so `dist/` exists.

The encoder enforces these invariants itself — do NOT add them by hand:

- Area reports get the matching context layer (EEZ/FAO/RFMO/MPA outline) added automatically.
- An AIS fishing-effort layer that sets any filter also gets the app default `distance_from_port_km: "3"` added, unless you set that key yourself (URL filters replace the dataview defaults).
- Layer-library instance ids get their `dataviewId` filled from the dictionary; `{PIPE_DATASET_VERSION}` tokens resolve to the current dataset pipeline version.
- `start`/`end` snap to the **closest** boundary of the map's interval resolution (month for ~year ranges, day for short ones). An `end` inside the last month rounds down and drops that month — see the `end` rule in step 4.

## Have a current map URL? Modify it, don't rebuild

When the input includes the user's **current map URL** (a follow-up like "and by flag?", "what about other gear types?", "are there non-fishing vessels?"):

1. Decode it with the sibling `decode-url` skill: `node ../decode-url/scripts/decode-url.mjs '<url>'`.
2. Take the `raw` field of the output as the base state, apply the **smallest change** that answers the intent.
3. Re-encode the whole thing: `{"route": <decoded route>, "state": <modified raw>}` through `encode-url.mjs`. Never string-edit the query — hand-patching leaves stale/duplicated params and skips normalization.

Rules for the change:

- **Preserve everything unmentioned, verbatim.** Params commonly dropped by accident that MUST carry over: viewport (`latitude`/`longitude`/`zoom` — keep exact input values, don't recompute), time (`start`/`end` — change only on a new period), report buffer (`reportBufferOperation`/`reportBufferUnit`/`reportBufferValue`), temporal filters `firstTransmissionDate`/`lastTransmissionDate` (even when empty — emit `fTD=&lTD=`), and every existing `dataviewInstances` entry at its current visibility, color and filters. Do NOT hide, drop, reorder, or strip filters from a layer the user didn't ask to change.
- **Filter refinements edit the existing layer in place.** "Any passenger boats?", "squid jiggers?", "only trawlers?" set that filter on the layer already present, keeping its id/color/category — do NOT create a second layer for the filtered subset. Reserve new instances for genuinely additive intents that introduce a DIFFERENT category or data source ("also show detections", "add SAR"), leaving current layers visible.
- **Clearing a filter emits it empty — never drop the key.** "Other / the rest / remaining / non-<current>" means broaden the existing filter: set it to `''` (`geartype=`), never enumerate the complement as a value list, never fabricate a new layer to hold it. An omitted key is NOT a cleared filter.
- **A country/region constraint is an area report, not just a flag filter.** "only in <country>", "restricted to <region>" → convert the route to a `report` over that country's EEZ (grep [references/areas.json](references/areas.json) for `datasetId`/`areaId`), keeping all existing layers/filters.

## Build a new state

1. **Pick the route type** from the user intent (details in [references/routes.md](references/routes.md)):
   - browse/compare activity on the map → `workspace`
   - aggregated report over an area (EEZ, FAO, RFMO) → `report` (needs `datasetId` + `areaId`). Multiple areas in one report → pass `datasetId`/`areaId` as comma-joined lists of equal length (one datasetId per areaId), e.g. `"datasetId":"public-fao-major,public-fao-major","areaId":"41,87"` → path `/platform/map/fishing-activity/default-public/report/public-fao-major%2Cpublic-fao-major/41%2C87`. Adding an area to an existing report = append its dataset+id to both.
   - port activity profile → `ports-report` (needs `portId`)
   - vessel profile → `vessel` (needs `vesselId`)
   - find a vessel by name/MMSI/IMO/owner → `vessel-search`
   - user account / saved workspaces → `user`
   - If both a `workspace` (browse on the map) and a `report` (aggregated stats over an area) could serve the intent, return both results — the map view and the report — so the user picks.
2. **Pick layers** as `state.dataviewInstances` using the instance ids in [references/layers.md](references/layers.md):
   - A layer the user wants: `{ "id": "<instance-id>", "config": { "visible": true, ... } }`.
   - Default-workspace layers the user does NOT want (`ais`, `vms` are visible by default) must be included with `"config": { "visible": false }` — otherwise the app shows them anyway.
   - Generic "fishing" intent → show AIS fishing effort (`ais`) and hide `vms` with `"config": { "visible": false }` unless the user specifically wants VMS. Only keep `vms` visible when asked for VMS/national-fleet data.
   - Layers not in the default workspace need `dataviewId` too (see layers.md).
   - Multiple visible instances of the same category (e.g. two fishing-effort layers filtered per flag): give each a distinct color so they're visually separable. `color` and `colorRamp` are one choice — set both to a matching palette entry (ramp id + its paired hex, table in query-params.md); don't repeat a ramp within the category.
3. **Set filters** in `config.filters` — valid filter ids and enum values per dataset are in [references/filters.md](references/filters.md). Flags are ISO3 codes (`ESP`, `FRA`, `CHN`).
   - Multiple flags → one instance per flag (each with its own `filters.flag` + distinct color/colorRamp per the rule above), so they compare side by side. Only combine flags into a single instance's `filters.flag` array when the user asks for the combined/total (e.g. "Spain and France together").
4. **Set the rest of the state** ([references/query-params.md](references/query-params.md)): `start`/`end` (ISO datetimes), `latitude`/`longitude`/`zoom`, and `timebarVisualisation` (`heatmap` for activity, `heatmapDetections` for detections, `events` for encounters/loitering/port visits).
   - **`end` is exclusive**: midnight UTC of the day _after_ the period. "2025" → `start: 2025-01-01T00:00:00.000Z`, `end: 2026-01-01T00:00:00.000Z`. "May 2025" → `2025-05-01` → `2025-06-01`. "January to March" → `end` = April 1st. Never set `end` to the first day of the last month (`2025-12-01` shows Jan–Nov).
   - **Relative time periods**: compute `start`/`end` with plain date math from the current datetime (e.g. "last year" = now minus 1 year → now).
5. **Look up ids when needed**: grep [references/areas.json](references/areas.json) for EEZ/FAO/RFMO area ids (one area per line, each hit carries `datasetId` + `areaId` + `label`) and [references/ports.json](references/ports.json) for port ids (large file — always grep by name, never read it whole).
   - A country → its EEZ (`grep -i "spain eez"`). A sea basin / ocean region ("Mediterranean", "Southwest Atlantic", "FAO 87") → an FAO major area; labels read `FAO <code> <Ocean>, <Direction> (<Direction> <Ocean>)`, so grep the code or either word order. An RFMO acronym (ICCAT, IOTC…) → RFMO.
   - Region not in areas.json → no area `report` possible (needs a real `areaId`). Options: (a) a `workspace` framed by viewport — set `latitude`/`longitude`/`zoom` to your best estimate of the region's center; (b) a **global report** for whole-world stats. Global report = `route.type` `report` with NO `datasetId`/`areaId` (→ `/platform/map/reports/default-public/report`); set viewport to world (`latitude: 0`, `longitude: 0`, `zoom: ~0.8`, not `0`). A global/whole-world report keeps ALL default-workspace layers VISIBLE (`ais`, `vms`, `presence`, `sar`, `sentinel2`, `viirs`, `encounters`, `loitering`, `port-visits`) — do not hide them and do not include only the one the user named. Use the global report when the user wants aggregated numbers but no specific area matches.
6. **Run the script** (usage above). Input shape:

```json
{
  "route": {
    "type": "workspace|workspaces-list|report|vessel|vessel-search|ports-report|vessel-group-report|user",
    "datasetId": "...",
    "areaId": "...",
    "vesselId": "...",
    "portId": "...",
    "vesselGroupId": "..."
  },
  "state": {
    "dataviewInstances": [],
    "start": "...",
    "end": "...",
    "latitude": 0,
    "longitude": 0,
    "zoom": 1,
    "timebarVisualisation": "events"
  }
}
```

Omit `category`/`workspaceId`: `workspace` → `/platform/map`, `vessel` → `/platform/vessel/<id>`, `vessel-search` → `/platform/vessel-search`. Area, port and vessel-group reports need the workspace segments and default to `fishing-activity`/`default-public` (global report: `reports`/`default-public`).

## Judgment rules

- **Multi-country fishing intent = WORKSPACE with one layer per flag, not a multi-area report.** "Fishing of Peru, Argentina, Brazil and Chile" → a `workspace` with one fishing-effort-ais layer per flag, each with `filters.flag` and a distinct color/colorRamp.
- **Curated workspaces are links, never a base.** Always build state on `default-public`. When the region matches a curated workspace in [highlighted-workspaces.md](references/highlighted-workspaces.md) (Galapagos, Palau, Mediterranean…), add its bare URL as an extra "see also" link — no state or query on top.
- **An EEZ may have a national fishing-effort dataset** (e.g. Ecuador, Brazil). Prefer it over plain global `ais` for that flag/region — pattern in [layers.md](references/layers.md#national-fishing-effort-datasets).
- **Viewport**: set it for `workspace` routes (the region's center, not `0,0`, when a region is named). Don't set it for area `report` routes — the app computes it from the area. On follow-ups, keep the input viewport verbatim.

Worked examples of real intents → inputs: [references/examples.md](references/examples.md). Real conversation transcripts with expected output URLs: [references/examples-conversations.md](references/examples-conversations.md).

A state param not covered in query-params.md may still exist — the app state types carry full JSDoc: `apps/platform/types/index.ts`, `features/_reports/reports.types.ts`, `features/_vessels/vessel/vessel.types.ts`, `features/_vessels/search/search.types.ts`.
