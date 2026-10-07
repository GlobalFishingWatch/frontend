# GFW layers dictionary

Sources: `apps/platform/data/map/layer-library`, `apps/platform/config/map/workspaces.ts` (instance id constants), `libs/skills/src/encode-url/dictionary.ts` (encoder's id → dataview resolution).

## Default workspace instances

Already in the default workspace — reference by `id` alone, NO `dataviewId` needed.
`ais` and `vms` start VISIBLE: hide them explicitly (`"config": {"visible": false}`) when not wanted.
FAO areas and high seas are NOT default instances (`context-layer-fao-areas` renders nothing on `default-public`): add them as library instances `fao-major__<ts>` / `high-seas__<ts>` (see Context below).

| Instance id                 | Layer                                               | Category    | Default |
| --------------------------- | --------------------------------------------------- | ----------- | ------- |
| `ais`                       | Apparent fishing effort (AIS)                       | activity    | visible |
| `vms`                       | Apparent fishing effort (VMS, national registries)  | activity    | visible |
| `presence`                  | Vessel presence (all AIS vessels, not only fishing) | activity    | hidden  |
| `sar`                       | Vessel detections (SAR radar, all weather)          | detections  | hidden  |
| `sentinel2`                 | Vessel detections (Sentinel-2 optical)              | detections  | hidden  |
| `viirs-skylight`            | Night light detections (VIIRS Skylight)             | detections  | hidden  |
| `encounters`                | Encounter events (two vessels meeting at sea)       | events      | hidden  |
| `loitering`                 | Loitering events (vessel idling at sea)             | events      | hidden  |
| `port-visits`               | Port visit events                                   | events      | hidden  |
| `context-layer-eez`         | EEZs                                                | context     | hidden  |
| `context-layer-mpa`         | MPAs                                                | context     | hidden  |
| `context-layer-rfmo`        | RFMOs                                               | context     | hidden  |
| `context-layer-graticules`  | Lat/lon grids                                       | context     | hidden  |
| `bathymetry`                | Bathymetry                                          | environment | hidden  |
| `basemap`, `basemap-labels` | Basemap                                             | context     | visible |

## Layer library (add on top of defaults)

Need `id` (append `__<unique-number>` if the base id collides with an existing instance) AND `dataviewId`.
Dataview slugs are versioned by the dataset pipeline: write the literal `{PIPE_DATASET_VERSION}` token and the encode script resolves it (from the `PIPE_DATASET_VERSION` env variable, default `4`) — e.g. `apparent-fishing-effort-ais-v-{PIPE_DATASET_VERSION}` → `apparent-fishing-effort-ais-v-4`.

### Activity

| Library id           | dataviewId                                             | Default filters              |
| -------------------- | ------------------------------------------------------ | ---------------------------- |
| `fishing-effort-ais` | `apparent-fishing-effort-ais-v-{PIPE_DATASET_VERSION}` | `distance_from_port_km: "3"` |
| `fishing-effort-vms` | `apparent-fishing-effort-vms-v-{PIPE_DATASET_VERSION}` |                              |
| `presence`           | `presence-activity-v-{PIPE_DATASET_VERSION}`           |                              |

#### National fishing-effort datasets

Some EEZs have a national fishing-effort dataset (mixes VMS + local AIS) that's more complete for that country than the global layer alone. Use it instead of / alongside plain `ais` when the intent is fishing activity of a flag inside that specific EEZ.

Pattern: keep `dataviewId` as the base `vms`/`fishing-effort-vms` dataview, but override `config.datasets` with the national dataset id PLUS the global one, and filter by flag:

```json
{
  "id": "fishing-effort-vms__<unique>",
  "config": {
    "visible": true,
    "datasets": ["public-<country>-fishing-effort:v<version>", "public-global-fishing-effort:v4.0"],
    "filters": { "flag": ["<ISO3>"] }
  }
}
```

Only `flag` is safe here: the national and global datasets use different `geartype` vocabularies, so a gear filter across both fails in the encoder (see filters.md, VMS section).

Known national dataset ids (source: `gfw-terraform-api-resources/resources/datasets`, `dataviews/shared_countries.tf`) — flag is the ISO3 to filter on:

| Country          | ISO3  | Public dataset id                        |
| ---------------- | ----- | ---------------------------------------- |
| Belize           | `BLZ` | `public-belize-fishing-effort:v20220304` |
| Brazil           | `BRA` | `public-vms-bra-fishing-effort:v4.0`     |
| Chile            | `CHL` | `public-vms-chl-fishing-effort:v4.1`     |
| Costa Rica       | `CRI` | `public-vms-cri-fishing-effort:v4.0`     |
| Ecuador          | `ECU` | `public-vms-ecu-fishing-effort:v4.0`     |
| Norway           | `NOR` | `public-vms-nor-fishing-effort:v4.0`     |
| Panama           | `PAN` | `public-vms-pan-fishing-effort:v4.1`     |
| Peru             | `PER` | `public-vms-per-fishing-effort:v4.0`     |
| Papua New Guinea | `PNG` | `public-vms-png-fishing-effort:v4.0`     |

### Detections

| Library id       | dataviewId                                      |
| ---------------- | ----------------------------------------------- |
| `viirs`          | `viirs-match-v-{PIPE_DATASET_VERSION}`          |
| `viirs-skylight` | `viirs-match-skylight-v-{PIPE_DATASET_VERSION}` |
| `sar`            | `sar-v-{PIPE_DATASET_VERSION}`                  |
| `sentinel2`      | `sentinel-2-v-{PIPE_DATASET_VERSION}`           |

### Events

| Library id    | dataviewId                                           |
| ------------- | ---------------------------------------------------- |
| `encounters`  | `encounter-cluster-events-v-{PIPE_DATASET_VERSION}`  |
| `loitering`   | `loitering-cluster-events-v-{PIPE_DATASET_VERSION}`  |
| `port-visits` | `port-visit-cluster-events-v-{PIPE_DATASET_VERSION}` |

### Context

| Library id                      | dataviewId             |
| ------------------------------- | ---------------------- |
| `eez`                           | `eez`                  |
| `mpa`                           | `mpa`                  |
| `protectedseas`                 | `protected-seas`       |
| `mpatlas`                       | `mpatlas`              |
| `fao-major`                     | `fao-areas`            |
| `rfmo`                          | `tuna-rfmo-areas`      |
| `high-seas`                     | `high-seas`            |
| `eez-areas-12nm`                | `eez-12-nm`            |
| `offshore-fixed-infrastructure` | `fixed-infrastructure` |
| `port-locations`                | `ais-ports`            |
| `port-locations-vms`            | `vms-ports`            |
| `graticules`                    | `graticules`           |
| `high-seas-pockets`             | `high-seas-pocket`     |
| `gfcm-fao`                      | `gfcm-fao`             |
| `paa-duke`                      | `paa-duke`             |

### Environment

Template dataviews: several library layers share one `dataviewId`, so each instance carries its own dataset in `datasetsConfig`. Copy the row EXACTLY — dataset ids, endpoint and params are not guessable. Instance shape (note `datasetsConfig` and `category` at the TOP level, never inside `config`):

```json
{
  "id": "sst__1783953707644",
  "dataviewId": "heatmap-environmental-layer",
  "category": "environment",
  "config": { "color": "#FF6854", "colorRamp": "red" },
  "datasetsConfig": [
    {
      "datasetId": "public-global-sst:v20231213",
      "endpoint": "4wings-tiles",
      "params": [{ "id": "type", "value": "heatmap" }]
    }
  ]
}
```

`id` = `<library id>__<timestamp>`. Use `timebarVisualisation: "environment"` when an environment layer is the subject.

Heatmap layers — `dataviewId: heatmap-environmental-layer`, `endpoint: 4wings-tiles`, `params: [{ "id": "type", "value": "heatmap" }]`:

| Library id          | Layer                                    | datasetId                                   | color     | colorRamp |
| ------------------- | ---------------------------------------- | ------------------------------------------- | --------- | --------- |
| `sst`               | Sea surface temperature                  | `public-global-sst:v20231213`               | `#FF6854` | `red`     |
| `sst-anomalies`     | SST anomalies (warmer/colder than usual) | `public-global-sst-anomalies:v20231213`     | `#FFAA0D` | `orange`  |
| `sst-anomalies-min` | SST anomalies min (colder than normal)   | `public-global-sst-anomalies-min:v20231213` | `#FFEA00` | `yellow`  |
| `sst-anomalies-max` | SST anomalies max (warmer than normal)   | `public-global-sst-anomalies-max:v20231213` | `#FF6854` | `red`     |
| `chlorophyl`        | Chlorophyll-a (productivity)             | `public-global-chlorophyl:v20231213`        | `#FFEA00` | `yellow`  |
| `salinity`          | Salinity                                 | `public-global-salinity:v20231213`          | `#9CA4FF` | `lilac`   |
| `oxygen`            | Oxygen                                   | `public-global-oxygen:v20231213`            | `#00EEFF` | `sky`     |
| `nitrate`           | Nitrate                                  | `public-global-nitrate:v20231213`           | `#FF6854` | `red`     |
| `phosphate`         | Phosphate                                | `public-global-phosphate:v20231213`         | `#A6FF59` | `green`   |
| `ph`                | pH                                       | `public-global-ph:v20231213`                | `#9CA4FF` | `lilac`   |
| `thgt`              | Wave height                              | `public-global-thgt:v20231213`              | `#FFAE9B` | `salmon`  |

Polygon layers — `dataviewId: gfw-environmental-layer`, `endpoint: context-tiles`, `params: []`, `color` only (no `colorRamp`):

| Library id          | datasetId                  | color     |
| ------------------- | -------------------------- | --------- |
| `seamounts`         | `public-seamounts`         | `#00EEFF` |
| `coral-reefs`       | `public-coral-reefs`       | `#FFAE9B` |
| `seagrasses`        | `public-seagrasses`        | `#FFEA00` |
| `mangroves`         | `public-mangroves`         | `#A6FF59` |
| `marine-ecoregions` | `public-marine-ecoregions` | `#4184F4` |

```json
{
  "id": "seamounts__1783953707644",
  "dataviewId": "gfw-environmental-layer",
  "category": "environment",
  "config": { "color": "#00EEFF" },
  "datasetsConfig": [{ "datasetId": "public-seamounts", "endpoint": "context-tiles", "params": [] }]
}
```

Own dataview (no `datasetsConfig`, only `id` + `dataviewId`): `currents` → `currents` (`#00EEFF`/`sky`), `winds` → `winds` (`#9CA4FF`/`lilac`). `bathymetry` is a default instance: `{ "id": "bathymetry", "config": { "visible": true } }`.

Value range on a heatmap environment layer ("water between 20 and 25 degrees", the layer's histogram filter) → `config.minVisibleValue` / `config.maxVisibleValue` (numbers, layer units: °C for `sst`). Omit the bound the user did not give.

## Vessel track layers

Instance id `vessel-<vesselId>` — added automatically when pinning a vessel; rarely built by hand.
