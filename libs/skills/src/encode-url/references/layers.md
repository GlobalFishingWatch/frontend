# GFW layers dictionary

Sources: `apps/fishing-map/data/layer-library`, `apps/fishing-map/config/src/workspaces.ts` (instance id constants), `libs/skills/src/encode-url/dictionary.ts` (encoder's id → dataview resolution).

## Default workspace instances

Already in the default workspace — reference by `id` alone, NO `dataviewId` needed.
`ais` and `vms` start VISIBLE: hide them explicitly (`"config": {"visible": false}`) when not wanted.

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
| `context-layer-fao-areas`   | FAO major fishing areas                             | context     | hidden  |
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

| Library id                                                                 | dataviewId                    | Layer                   |
| -------------------------------------------------------------------------- | ----------------------------- | ----------------------- |
| `currents`                                                                 | `currents`                    | Currents                |
| `winds`                                                                    | `winds`                       | Winds                   |
| `bathymetry`                                                               | `heatmap-static-layer`        | Bathymetry              |
| `chlorophyl`                                                               | `heatmap-environmental-layer` | Chlorophyll-a           |
| `sst`                                                                      | `heatmap-environmental-layer` | Sea surface temperature |
| `sst-anomalies` / `-min` / `-max`                                          | `heatmap-environmental-layer` | SST anomalies           |
| `salinity`, `oxygen`, `nitrate`, `phosphate`, `ph`, `thgt` (wave height)   | `heatmap-environmental-layer` |                         |
| `marine-ecoregions`, `mangroves`, `seamounts`, `coral-reefs`, `seagrasses` | `gfw-environmental-layer`     |                         |

Environment layers with `heatmap-environmental-layer`/`gfw-environmental-layer` template dataviews also need their dataset in `config.datasets`, e.g. `["public-global-sst:v20231213"]` — dataset ids follow `public-global-<id>:v20231213`.

## Vessel track layers

Instance id `vessel-<vesselId>` — added automatically when pinning a vessel; rarely built by hand.
