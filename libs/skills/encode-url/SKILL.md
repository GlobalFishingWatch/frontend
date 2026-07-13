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
   - aggregated report over an area (EEZ, FAO, RFMO) → `report` (needs `datasetId` + `areaId`)
   - port activity profile → `ports-report` (needs `portId`)
   - vessel profile → `vessel` (needs `vesselId`)
   - find a vessel by name/MMSI/IMO/owner → `vessel-search`
   - user account / saved workspaces → `user`
2. **Pick layers** as `state.dataviewInstances` using the instance ids in [references/layers.md](references/layers.md). Rules:
   - A layer the user wants: `{ "id": "<instance-id>", "config": { "visible": true, ... } }`.
   - Default-workspace layers the user does NOT want (`ais`, `vms` are visible by default) must be included with `"config": { "visible": false }` — otherwise the app shows them anyway.
   - Layers not in the default workspace need `dataviewId` too (see layers.md). Versioned dataview slugs take the literal `{PIPE_DATASET_VERSION}` token (e.g. `sar-v-{PIPE_DATASET_VERSION}`) — the script resolves it from the `PIPE_DATASET_VERSION` env variable so URLs always target the latest dataset pipeline version.
3. **Set filters** in `config.filters` — valid filter ids and enum values per dataset are in [references/filters.md](references/filters.md). Flags are ISO3 codes (`ESP`, `FRA`, `CHN`).
4. **Set the rest of the state** ([references/query-params.md](references/query-params.md)): `start`/`end` (ISO datetimes), `latitude`/`longitude`/`zoom`, and `timebarVisualisation` (`heatmap` for activity, `heatmapDetections` for detections, `events` for encounters/loitering/port visits).
5. **Look up ids when needed**: grep [references/areas.json](references/areas.json) for EEZ/FAO/RFMO area ids and [references/ports.json](references/ports.json) for port ids (large file — always grep by name, never read it whole).
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

Requires node >= 23 (uses `module.registerHooks`). In the monorepo run `pnpm nx dist skills` once so `dist/` exists.
