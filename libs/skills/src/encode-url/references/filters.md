# Dataset filters (config.filters)

Valid filter ids + values per layer, from the GFW API dataset definitions.
Filters go in each dataview instance's `config.filters`. Array filters take arrays (`"flag": ["FRA", "ESP"]`).

## Fishing effort (`ais`, `vms`, `fishing-effort-ais`) — dataset `public-global-fishing-effort:v4.0`

| Filter                  | Values                                                                                                                                                                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flag`                  | ISO3 country codes                                                                                                                                                                                                                                                                              |
| `geartype`              | `tuna_purse_seines`, `driftnets`, `trollers`, `set_longlines`, `purse_seines`, `pots_and_traps`, `other_fishing`, `dredge_fishing`, `set_gillnets`, `fixed_gear`, `trawlers`, `fishing`, `seiners`, `other_purse_seines`, `other_seines`, `squid_jigger`, `pole_and_line`, `drifting_longlines` |
| `distance_from_port_km` | `0`-`5` (gte). Default `"3"` filters out anchored vessels                                                                                                                                                                                                                                       |
| `vessel-groups`         | vessel group id (single)                                                                                                                                                                                                                                                                        |

## Vessel presence (`presence`) — dataset `public-global-presence:v4.0`

| Filter          | Values                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `flag`          | ISO3                                                                                                              |
| `vessel_type`   | `carrier`, `seismic_vessel`, `passenger`, `other`, `support`, `bunker`, `gear`, `cargo`, `fishing`, `discrepancy` |
| `speed`         | `<2`, `2-4`, `4-6`, `6-10`, `10-15`, `15-25`, `>25` (knots)                                                       |
| `vessel-groups` | vessel group id                                                                                                   |

## SAR (`sar`) / Sentinel-2 (`sentinel2`) detections

| Filter                          | Values                                                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matched`                       | `true` (identified vessel) / `false` (DARK VESSEL — not broadcasting AIS)                                                                                                                                                        |
| `flag`                          | ISO3 (only matched detections have a flag)                                                                                                                                                                                       |
| `geartype`                      | 28-value enum: fishing gears above + `cargo_or_tanker`, `passenger`, `specialized_reefer`, `carrier`, `tug`, `bunker`, `patrol_vessel`, `seismic_vessel`, `non_fishing`, `inconclusive`, `cargo`, `purse_seine_support`, `other` |
| `shiptype`                      | `carrier`, `seismic_vessel`, `passenger`, `other`, `support`, `bunker`, `gear`, `cargo`, `fishing`, `discrepancy`                                                                                                                |
| `neural_vessel_type` (SAR only) | `Likely non-fishing`, `Likely Fishing`, `Unknown`                                                                                                                                                                                |
| `length` (Sentinel-2 only)      | `<20`, `20-60`, `60-100`, `>100` (meters)                                                                                                                                                                                        |

## VIIRS Skylight (`viirs-skylight`) — dataset `public-global-skylight-viirs:v1.0`

| Filter     | Values                          |
| ---------- | ------------------------------- |
| `matched`  | `true` / `false` (dark vessels) |
| `radiance` | range [0, 1000]                 |
| `flag`     | ISO3                            |

## Encounters (`encounters`) — dataset `public-global-encounters-events:v4.0`

| Filter           | Values                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `encounter_type` | `CARRIER-FISHING`, `SUPPORT-FISHING`, `FISHING-CARRIER`, `FISHING-BUNKER`, `FISHING-FISHING`, `CARRIER-BUNKER`, `FISHING-SUPPORT` |
| `duration`       | range [2, 48] hours                                                                                                               |
| `flag`           | ISO3                                                                                                                              |
| `next_port_id`   | port id (ports.json)                                                                                                              |
| `vessel-groups`  | vessel group id                                                                                                                   |

## Loitering (`loitering`) / Port visits (`port-visits`)

| Filter                                                                     | Values                                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `type` (vessel type)                                                       | `CARGO`, `DISCREPANCY`, `CARRIER`, `FISHING`, `GEAR`, `OTHER`, `PASSENGER`, `SEISMIC_VESSEL`, `SUPPORT` |
| `duration`                                                                 | range [2, 48] hours                                                                                     |
| `flag`                                                                     | ISO3                                                                                                    |
| `next_port_id` (loitering) / `port_id` (port visits, e.g. `arg-camarones`) | port id                                                                                                 |
| `vessel-groups`                                                            | vessel group id                                                                                         |

## Common patterns

- Dark vessel analysis: detections layers (`sar`, `sentinel2`, `viirs-skylight`) with `"matched": ["false"]` + `timebarVisualisation: "heatmapDetections"`.
- Fleet analysis: `flag` + `geartype` on fishing effort; `flag` + `vessel_type` on presence.
- Filter values are always strings in the URL, including booleans and numbers: `"matched": ["false"]`, `"distance_from_port_km": "3"`.
