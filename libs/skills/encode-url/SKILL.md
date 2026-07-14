---
name: encode-url
description: Build a GFW map URL (and TanStack Router navigation config) that matches exactly what the fishing-map app generates. Use when the user wants to see, compare or review ocean activity (fishing effort, vessel presence, detections, encounters, loitering, port visits, environment layers), open a report over an area or port, open a vessel profile, or search vessels — and you need to produce the link or in-app navigation for it.
---

# Encode GFW map URL

Turn a navigation intent into `{ navigation, path }`:

- `navigation`: TanStack Router config (`to`, `params`, `search`) — use to navigate from inside the map app.
- `path`: path + encoded query string (e.g. `/map/fishing-activity/default-public?...`) — for external navigation prepend the origin `https://globalfishingwatch.org`.

Never hand-build the query string: params are abbreviated (`dataviewInstances`→`dvIn`, `config`→`cfg`, `visible`→`vis`…) and repeated values are tokenized (`~0`). The script does this with the app's own encoder.

## Workflow

1. **Pick the route type** from the user intent (details in [references/routes.md](references/routes.md)):
   - browse/compare activity on the map → `workspace`
   - a marine protected area / region with a curated workspace (Galapagos, Palau, Fiji, Mediterranean…) or a global curated report (activity, dark vessel detections, events, deep sea mining) → ids in [references/highlighted-workspaces.md](references/highlighted-workspaces.md)
   - aggregated report over an area (EEZ, FAO, RFMO) → `report` (needs `datasetId` + `areaId`)

- An area report must ALSO include the matching **context layer** as a visible instance so the area outline renders: `context-layer-eez` / `context-layer-fao` / `context-layer-rfmo` / `context-layer-mpa` (pick by area type; dataviewId in [references/layers.md](references/layers.md)), `{ "config": { "visible": true } }`. Missing it drops the area boundary.

- Multiple areas in one report → pass `datasetId`/`areaId` as comma-joined lists of equal length (one datasetId per areaId), e.g. `"datasetId":"public-fao-major,public-fao-major","areaId":"41,87"` → path `/report/public-fao-major%2Cpublic-fao-major/41%2C87`. Adding an area to an existing report = append its dataset+id to both. Re-center viewport (`latitude`/`longitude`/`zoom`) on the combined area set rather than keeping the source values.
  - port activity profile → `ports-report` (needs `portId`)
  - vessel profile → `vessel` (needs `vesselId`)
  - find a vessel by name/MMSI/IMO/owner → `vessel-search`
  - user account / saved workspaces → `user`

- marine-manager workspaces index → static path `/map/marine-manager` (no state/query at all)
  - If both a `workspace` (browse on the map) and a `report` (aggregated stats over an area) could serve the intent, return both results — the map view and the report — so the user picks.

2. **Pick layers** as `state.dataviewInstances` using the instance ids in [references/layers.md](references/layers.md). Rules:
   - A layer the user wants: `{ "id": "<instance-id>", "config": { "visible": true, ... } }`.
   - Default-workspace layers the user does NOT want (`ais`, `vms` are visible by default) must be included with `"config": { "visible": false }` — otherwise the app shows them anyway.
   - Generic "fishing" intent → show AIS fishing effort (`ais`) and hide `vms` with `"config": { "visible": false }` unless the user specifically wants VMS. Only keep `vms` visible when asked for VMS/national-fleet data.
   - Layers not in the default workspace need `dataviewId` too (see layers.md). Versioned dataview slugs take the literal `{PIPE_DATASET_VERSION}` token (e.g. `sar-v-{PIPE_DATASET_VERSION}`) — the script resolves it from the `PIPE_DATASET_VERSION` env variable so URLs always target the latest dataset pipeline version.
   - Multiple visible instances of the same category (e.g. two fishing-effort layers filtered per flag): give each a distinct color so they're visually separable. `color` and `colorRamp` are one choice — set both to a matching palette entry (ramp id + its paired hex, table in query-params.md); don't repeat a ramp within the category.
3. **Set filters** in `config.filters` — valid filter ids and enum values per dataset are in [references/filters.md](references/filters.md). Flags are ISO3 codes (`ESP`, `FRA`, `CHN`).
   - Multiple flags → one instance per flag (each with its own `filters.flag` + distinct color/colorRamp per the rule above), so they compare side by side. Only combine flags into a single instance's `filters.flag` array when the user asks for the combined/total (e.g. "Spain and France together").
4. **Set the rest of the state** ([references/query-params.md](references/query-params.md)): `start`/`end` (ISO datetimes), `latitude`/`longitude`/`zoom`, and `timebarVisualisation` (`heatmap` for activity, `heatmapDetections` for detections, `events` for encounters/loitering/port visits).

- **Relative time periods**: compute `start`/`end` with plain date math from the current datetime (e.g. "last year" = now minus 1 year → now). The encoder snaps both to the map's interval resolution automatically
  - **Report viewport = don't set it.** For an area report the tools is going to calculate it dinamycally.

5. **Look up ids when needed**: grep [references/areas.json](references/areas.json) for EEZ/FAO/RFMO area ids and [references/ports.json](references/ports.json) for port ids (large file — always grep by name, never read it whole).
   - Region not in areas.json → no area `report` possible (needs a real `areaId`). Options: (a) a `workspace` framed by viewport — set `latitude`/`longitude`/`zoom` to your best estimate of the region's center; (b) a **global report** for whole-world stats. Global report = `route.type` `report` with NO `datasetId`/`areaId` (→ `/reports/default-public/report`); set viewport to world (`latitude: 0`, `longitude: 0`, `zoom: ~0.8`, not `0`). A global/whole-world report keeps ALL default-workspace layers VISIBLE (`ais`, `vms`, `presence`, `sar`, `sentinel2`, `viirs`, `encounters`, `loitering`, `port-visits`) — do not hide them and do not include only the one the user named. Use the global report when the user wants aggregated numbers but no specific area matches.
6. **Run the script**:

```bash
node scripts/encode-url.mjs '{"route":{"type":"report","datasetId":"public-eez-areas","areaId":"5682"},"state":{...}}'
# or pipe: echo '<json>' | node scripts/encode-url.mjs
```

Input shape:

```json
{
  "route": {
    "type": "workspace|report|vessel|vessel-search|ports-report|vessel-group-report|user",
    "category": "fishing-activity",
    "workspaceId": "default-public",
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

`category`/`workspaceId` default to `fishing-activity`/`default-public` when omitted.

Worked examples of real intents → inputs: [references/use-cases.md](references/use-cases.md).

## Working from an existing map URL

When the input gives a **current map URL** (a follow-up like "and by flag?", "what about other gear types?", "are there non-fishing vessels?"), decode it into the full state first and treat that as the base. Make the **smallest change** that answers the intent, then re-run the encoder on the whole state. Output = input state minus nothing, plus/edited only the user's delta.

- **Preserve everything unmentioned, verbatim.** Params commonly dropped by accident that MUST carry over:
  - viewport: `latitude`, `longitude`, `zoom` (keep the exact input values; don't recompute).
  - time: `start`, `end` (change only when the user gives a new period).
  - report buffer: `rBO`/`rBU`/`rBV` (`reportBufferOperation`/`reportBufferUnit`/`reportBufferValue`).
  - temporal filters: `fTD`/`lTD` (even when empty — emit `fTD=&lTD=`).
  - every existing `dataviewInstances` entry at its current visibility (id, category, dvId, color, colorRamp, filters). Do NOT hide, drop, reorder, or strip filters from a layer the user didn't ask to change.
- **Add, don't replace.** "Also show / are there also X" ADDS a new instance for X while leaving current layers visible — not toggle the current one off.
- **Minimal filter change, no enumeration.** "Other / the rest / remaining / non-<current>" relative to an applied filter means **clear/broaden that filter** (set it to `''` / remove it) on the existing layer. Never enumerate the complement as an explicit value list, and never fabricate a new layer to hold it.

- **A country/region constraint is an area report, not just a flag filter.** "only in <country>", "restricted to <region>" → convert the route to a `report` over that country's EEZ (grep [references/areas.json](references/areas.json) for its `datasetId`/`areaId`), keeping all existing layers/filters.
- **Re-encode, never string-edit.** Feed the full decoded+modified state through `scripts/encode-url.mjs`; hand-patching the query string leaves stale/duplicated params (e.g. a stale `zoom`) and skips normalization.

Requires node >= 23 (uses `module.registerHooks`). In the monorepo run `pnpm nx dist skills` once so `dist/` exists.

## Getting it right — priority rules (read first)

These exist because the same mistakes recur. They override any instinct to hand-build.

### 1. Preserve on follow-ups — and the global-report exception is narrow

- Carry over every unmentioned param verbatim: viewport, `start`/`end`, `rBO`/`rBU`/`rBV`, `fTD=`/`lTD=`, and every existing layer at its current visibility/filters.

### 2. Filter-refinement follow-ups modify the existing layer in place — do NOT add a new one

- Questions like "any passenger boats?", "squid jiggers?", "only trawlers?" refine an EXISTING layer: set that filter on the layer already present, keep its id/color/category. Do NOT create a second layer for the filtered subset.
- Reserve "add a new instance" for genuinely additive intents that introduce a DIFFERENT category or data source ("also show detections", "add SAR").
- "Other / the rest / remaining / non-<current>" = clear/broaden the existing filter to empty; never enumerate the complement.

### 3. Clearing a filter emits it empty — never drop the key

- To broaden/clear a filter, output it as empty (`geartype=`), not by omitting it. An omitted key scores as `None` and fails; the app expects the empty value. This is a persistent, repeated loss.

### 4. AIS fishing-effort carries a default `distance_from_port_km=3`

- Every AIS apparent-fishing-effort layer (`ais` and `fishing-effort-ais__*`) includes `filters.distance_from_port_km=3` unless the user overrides it. Include it even when the user only mentioned a gear/flag filter.

### 5. Multi-country fishing intent = WORKSPACE with one layer per flag, not a multi-area report

- "Fishing of Peru, Argentina, Brazil and Chile" → a `workspace` with one fishing-effort-ais layer per flag, each with `filters.flag` and a distinct color/colorRamp
