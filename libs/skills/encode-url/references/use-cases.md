# Use case recipes

Real intents → encode-url inputs. Distilled from app-generated URLs.

## "Fishing effort by French and Spanish vessels"

Two instances of the same fishing-effort dataset, one filtered per flag, distinct colors; EEZ boundaries for context; hide VMS.

```json
{
  "route": { "type": "workspace" },
  "state": {
    "dataviewInstances": [
      { "id": "ais", "config": { "filters": { "flag": ["ESP"], "distance_from_port_km": "3" } } },
      {
        "id": "fishing-effort-ais__1783934376888",
        "dataviewId": "apparent-fishing-effort-ais-v-{PIPE_DATASET_VERSION}",
        "config": {
          "color": "#9CA4FF",
          "colorRamp": "lilac",
          "filters": { "flag": ["FRA"], "distance_from_port_km": "3" }
        }
      },
      { "id": "context-layer-eez", "config": { "visible": true } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "start": "2025-08-01T00:00:00.000Z",
    "end": "2026-08-01T00:00:00.000Z",
    "latitude": 44.97,
    "longitude": -2.9,
    "zoom": 5.2
  }
}
```

## "All passenger vessel activity last month"

Presence layer filtered by vessel type; hide fishing effort defaults; world viewport.

```json
{
  "route": { "type": "workspace" },
  "state": {
    "dataviewInstances": [
      {
        "id": "presence",
        "config": { "visible": true, "filters": { "vessel_type": ["passenger"] } }
      },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "start": "2026-06-10T00:00:00.000Z",
    "end": "2026-07-10T00:00:00.000Z",
    "latitude": 0,
    "longitude": 0,
    "zoom": 0.8
  }
}
```

## "Dark vessels around Gabon"

All detections layers with `matched=false`, EEZ context, `timebarVisualisation: "heatmapDetections"`, viewport over Gabon. Hide `ais`/`vms`. No time range → app default.

```json
{
  "route": { "type": "workspace" },
  "state": {
    "dataviewInstances": [
      { "id": "context-layer-eez", "config": { "visible": true } },
      {
        "id": "viirs-skylight",
        "config": { "visible": true, "filters": { "matched": ["false"] } }
      },
      { "id": "sar", "config": { "visible": true, "filters": { "matched": ["false"] } } },
      { "id": "sentinel2", "config": { "visible": true, "filters": { "matched": ["false"] } } },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "timebarVisualisation": "heatmapDetections",
    "latitude": -2.69,
    "longitude": 9.05,
    "zoom": 6.2
  }
}
```

Variant "VIIRS detections with Chinese flag": only `viirs-skylight` visible with `{ "matched": ["true"], "flag": ["CHN"] }` (flag only exists on matched detections).

## "Encounters in the last 7 days"

```json
{
  "route": { "type": "workspace" },
  "state": {
    "dataviewInstances": [
      { "id": "encounters", "config": { "visible": true } },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "timebarVisualisation": "events",
    "start": "2026-07-03T00:00:00.000Z",
    "end": "2026-07-10T00:00:00.000Z",
    "latitude": 0,
    "longitude": 3.8,
    "zoom": 0.8
  }
}
```

## "Loitering events around Malvinas on July 5th" (area report)

Report over EEZ area with a 50nm buffer; loitering visible, events timebar.

```json
{
  "route": { "type": "report", "datasetId": "public-eez-areas", "areaId": "8389" },
  "state": {
    "dataviewInstances": [
      { "id": "context-layer-eez", "config": { "visible": true } },
      { "id": "loitering", "config": { "visible": true } },
      { "id": "port-visits", "config": { "visible": false } },
      { "id": "encounters", "config": { "visible": false } },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "timebarVisualisation": "events",
    "start": "2026-07-05T00:00:00.000Z",
    "end": "2026-07-06T00:00:00.000Z",
    "reportBufferValue": 50,
    "reportBufferUnit": "nauticalmiles",
    "reportBufferOperation": "dissolve",
    "latitude": -52.24,
    "longitude": -58.66,
    "zoom": 4.5
  }
}
```

## "Trawlers activity report in Italy last year"

```json
{
  "route": { "type": "report", "datasetId": "public-eez-areas", "areaId": "5682" },
  "state": {
    "dataviewInstances": [
      { "id": "context-layer-eez", "config": { "visible": true } },
      {
        "id": "ais",
        "config": { "filters": { "distance_from_port_km": "3", "geartype": ["trawlers"] } }
      },
      { "id": "vms", "config": { "visible": false } }
    ],
    "start": "2025-08-01T00:00:00.000Z",
    "end": "2026-08-01T00:00:00.000Z",
    "latitude": 40.7,
    "longitude": 12.44,
    "zoom": 4.75
  }
}
```

## "Vessels visiting Camarones (Argentina) in July" (ports report)

```json
{
  "route": { "type": "ports-report", "portId": "arg-camarones" },
  "state": {
    "dataviewInstances": [
      {
        "id": "port-visits",
        "config": { "visible": true, "filters": { "port_id": "arg-camarones" } }
      },
      { "id": "ais", "config": { "visible": false } },
      { "id": "vms", "config": { "visible": false } }
    ],
    "timebarVisualisation": "events",
    "portsReportName": "CAMARONES",
    "portsReportCountry": "ARG",
    "portsReportDatasetId": "public-global-port-visits-events:v4.0",
    "start": "2026-07-01T00:00:00.000Z",
    "end": "2026-08-01T00:00:00.000Z",
    "latitude": -44.82,
    "longitude": -65.71,
    "zoom": 12.7
  }
}
```

## "Vessel profile for <name>"

First find the vessel id via vessel-search, then:

```json
{
  "route": { "type": "vessel", "vesselId": "90a000d54-4c9a-3567-de57-941d018f8117" },
  "state": {
    "vesselDatasetId": "public-global-vessel-identity:v4.0",
    "vesselSelfReportedId": "90a000d54-4c9a-3567-de57-941d018f8117",
    "vesselIdentitySource": "selfReportedInfo",
    "visibleEvents": ["fishing", "encounter", "port_visit", "gaps"],
    "dataviewInstances": [{ "id": "vms", "config": { "visible": false } }],
    "latitude": -44.23,
    "longitude": -64.97,
    "zoom": 8.5
  }
}
```

## "Search vessel by name / MMSI"

```json
{ "route": { "type": "vessel-search" }, "state": { "query": "lake aurora" } }
```

Advanced (owner + flag + active before date):

```json
{
  "route": { "type": "vessel-search" },
  "state": {
    "searchOption": "advanced",
    "owner": "andres",
    "flag": ["PAN"],
    "transmissionDateTo": "2026-06-01"
  }
}
```

## "My saved workspaces"

```json
{ "route": { "type": "user" }, "state": { "userTab": "workspaces" } }
```
