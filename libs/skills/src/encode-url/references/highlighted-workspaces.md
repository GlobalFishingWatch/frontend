# Highlighted workspaces (link only)

Curated public workspaces. **Never use one as the base for a built URL** — always build state on `default-public` (`/platform/map`). When the user's region matches a row below, add its URL as an extra "see also" link, as-is, with no query string.
Sources: `apps/platform/data/map/highlighted-workspaces/{marine-manager,reports}.ts`.

Prepend `https://globalfishingwatch.org` to every path.

## Marine Manager (MPA / region workspaces)

Index of all of them: `/platform/map/marine-manager`.

| Region / MPA                   | Workspace                                                     | Curated report                                         |
| ------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------ |
| Ascension Island               | `/platform/map/marine-manager/ascension-public`               |                                                        |
| Fiji                           | `/platform/map/marine-manager/fiji-public`                    |                                                        |
| Guyana                         | `/platform/map/marine-manager/guyana-public`                  |                                                        |
| Federated States of Micronesia | `/platform/map/marine-manager/micronesia-public`              |                                                        |
| Maldives                       | `/platform/map/marine-manager/maldives-public`                |                                                        |
| Niue                           | `/platform/map/marine-manager/niue-public`                    |                                                        |
| Palau                          | `/platform/map/marine-manager/palau-public`                   |                                                        |
| Tristan da Cunha               | `/platform/map/marine-manager/tristan-public`                 |                                                        |
| Mediterranean and Black Sea    | `/platform/map/marine-manager/mediterranean-public`           |                                                        |
| Costa Rica                     | `/platform/map/marine-manager/costa_rica-public`              | `/platform/map/reports/costa_rica-public`              |
| Colombia                       | `/platform/map/marine-manager/colombia-public`                | `/platform/map/reports/colombia-public`                |
| Panama                         | `/platform/map/marine-manager/panama-public`                  | `/platform/map/reports/panama-public`                  |
| CMAR core MPAs                 | `/platform/map/marine-manager/cmar_core_mpas-public`          | `/platform/map/reports/cmar_core_mpas-public`          |
| Galapagos and Hermandad        | `/platform/map/marine-manager/galapagos_and_hermandad-public` | `/platform/map/reports/galapagos_and_hermandad-public` |
| Rapa Nui                       | `/platform/map/marine-manager/rapanui-public`                 |                                                        |
| Revillagigedo                  | `/platform/map/marine-manager/revillagigedo-public`           | `/platform/map/reports/revillagigedo_mexico-public`    |

## Global curated reports

| Name                          | Report                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Global Vessel Activity        | `/platform/map/reports/activity-report/report`                                                                   |
| Global Dark Vessel Detections | `/platform/map/reports/detections-report/report`                                                                 |
| Global Vessel Events          | `/platform/map/reports/events-report/report`                                                                     |
| Deep Sea Mining Watch         | `/platform/map/fishing-activity/deep-sea-mining-public` (report: `/platform/map/reports/deep_sea_mining-public`) |

For whole-world stats you build yourself, use the global report on `default-public` described in SKILL.md step 5.
