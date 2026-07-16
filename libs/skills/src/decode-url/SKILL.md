---
name: decode-url
description: Decode a GFW map URL into structured context of what the user is currently seeing — route (map/report/vessel/search), visible layers with filters, time range and viewport. Use whenever you receive the user's current URL and need to understand or describe their view, or to modify it (decode, edit the raw state, re-encode with the encode-url skill).
---

# Decode GFW map URL

```bash
node scripts/decode-url.mjs '<url or path>'
```

Accepts a full URL (`https://globalfishingwatch.org/map/...`) or just the path. Output:

```json
{
  "route": {
    "type": "report",
    "category": "fishing-activity",
    "workspaceId": "default-public",
    "datasetId": "public-eez-areas",
    "areaId": "5682"
  },
  "workspaceName": "Default public workspace",
  "timeRange": { "start": "2025-08-01T00:00:00.000Z", "end": "2026-08-01T00:00:00.000Z" },
  "viewport": { "latitude": 40.7, "longitude": 12.4, "zoom": 4.7 },
  "timebarVisualisation": "events",
  "layers": [
    {
      "id": "ais",
      "name": "Apparent fishing effort (AIS)",
      "category": "activity",
      "visible": true,
      "filters": { "geartype": ["trawlers"] }
    }
  ],
  "report": { "reportBufferValue": 50 },
  "vessel": { "vesselSelfReportedId": "..." },
  "search": { "query": "lake aurora" },
  "raw": {}
}
```

How to narrate it:

- `route.type` says where the user is: `workspace` (map browsing), `report` (area report — `areaId` within `datasetId`, e.g. `public-eez-areas`; no `datasetId`/`areaId` = global report), `ports-report`, `vessel` (vessel profile), `vessel-search`, `vessel-group-report`, `user`, `workspaces-list`.
- `workspaceName` (when present) names a curated workspace: Marine Manager MPAs (`category: "marine-manager"`, e.g. Palau, Galapagos and Hermandad) or global curated reports (`activity-report`, `detections-report`, `events-report`, Deep Sea Mining Watch). Lead with it — "you're looking at the Palau Marine Manager workspace" beats reciting layers.
- Describe only `visible: true` layers; mention hidden ones only if relevant. Layer `filters` use API values: `flag` is ISO3 (translate to country names), `matched: ["false"]` on detections means dark vessels (no AIS match), `geartype`/`vessel_type` are fleet filters.
- `timeRange` is the analyzed period; no `timeRange` means the app default (roughly the last year).
- `raw` is the full parsed workspace state — edit it and feed it back to the encode-url skill (`{"route": <route>, "state": <raw>}`) to produce a modified view that keeps everything else identical.

Requires node >= 23 (uses `module.registerHooks`). In the monorepo run `pnpm nx dist skills` once so `dist/` exists.
