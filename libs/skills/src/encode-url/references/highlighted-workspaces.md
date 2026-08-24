# Highlighted workspaces (curated entry points)

Curated public workspaces preloaded with relevant layers. Prefer them over building from scratch when the user's intent matches one but use these ONLY if marine manager has been mentioned.
Sources: `apps/platform/data/map/highlighted-workspaces/{marine-manager,reports}.ts`.

## Marine Manager (MPA / region workspaces)

Route: `{ "type": "workspace", "category": "marine-manager", "workspaceId": "<id>" }` → `/map/marine-manager/<id>`
Any extra `state` (time range, filters, extra layers) applies on top of the curated workspace.

| workspaceId                      | Region / MPA                   | Curated report                                |
| -------------------------------- | ------------------------------ | --------------------------------------------- |
| `ascension-public`               | Ascension Island               |                                               |
| `fiji-public`                    | Fiji                           |                                               |
| `guyana-public`                  | Guyana                         |                                               |
| `micronesia-public`              | Federated States of Micronesia |                                               |
| `maldives-public`                | Maldives                       |                                               |
| `niue-public`                    | Niue                           |                                               |
| `palau-public`                   | Palau                          |                                               |
| `tristan-public`                 | Tristan da Cunha               |                                               |
| `mediterranean-public`           | Mediterranean and Black Sea    |                                               |
| `costa_rica-public`              | Costa Rica                     | yes                                           |
| `colombia-public`                | Colombia                       | yes                                           |
| `panama-public`                  | Panama                         | yes                                           |
| `cmar_core_mpas-public`          | CMAR core MPAs                 | yes                                           |
| `galapagos_and_hermandad-public` | Galapagos and Hermandad        | yes                                           |
| `rapanui-public`                 | Rapa Nui                       |                                               |
| `revillagigedo-public`           | Revillagigedo                  | yes (report id `revillagigedo_mexico-public`) |

"Curated report" = a report workspace exists with the same id (except where noted): `{ "type": "workspace", "category": "reports", "workspaceId": "<report id>" }`.

Example — "show me activity in the Galapagos":

```json
{
  "route": {
    "type": "workspace",
    "category": "marine-manager",
    "workspaceId": "galapagos_and_hermandad-public"
  }
}
```

## Global reports (curated report workspaces)

Route: `{ "type": "report", "category": "reports", "workspaceId": "<id>" }` (no `datasetId`/`areaId`) → `/map/reports/<id>/report`.
Use for whole-world aggregated stats when no specific area applies.

| workspaceId         | Name                          | Focus                                             |
| ------------------- | ----------------------------- | ------------------------------------------------- |
| `activity-report`   | Global Vessel Activity        | Global fishing effort / presence stats            |
| `detections-report` | Global Dark Vessel Detections | SAR / Sentinel-2 / VIIRS detections, dark vessels |
| `events-report`     | Global Vessel Events          | Encounters, loitering, port visits                |

Special: Deep Sea Mining Watch — a fishing-activity workspace with its own report:
`{ "type": "workspace", "category": "fishing-activity", "workspaceId": "deep-sea-mining-public" }` (report workspace id `deep_sea_mining-public`).

Example — "how many dark vessels were detected worldwide last month":

```json
{
  "route": { "type": "report", "category": "reports", "workspaceId": "detections-report" },
  "state": { "start": "2026-06-13T00:00:00.000Z", "end": "2026-07-13T00:00:00.000Z" }
}
```
