---
name: Fishing Event Filtering
slug: fishing-event-filtering
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx
    hash: 08fde6b31d989b7cc4ae0f10bbdfb58ce61f517d87c01aaef5657d8333ca0891
  - path: apps/platform/features/_vessels/vessel/insights/InsightGapsDetails.tsx
    hash: 9d3f12a553507acbef8fb5e52b8219b12c937bee137a6929e1e305b95031b88b
  - path: apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx
    hash: a38ccc18c14cc3b52a8a85cee95a8d90303000f8423a742b963691c3cbdbc3b9
  - path: apps/platform/features/_vessels/vessel/insights/insights.utils.ts
    hash: a17223f7fed918b9185d63eb2ef4c087f0d765da97bcc958bc332c896a81d1e9
sources_digest: 0e064e3d5d170bd6d66bb1eb4b922f13aaf3b03851f467923d5a49fb0de0aaec
links:
  - to: vessel-insights-display-system
    relation: part_of
    description: Tuna RFMO filtering is applied across all fishing-related insight displays
generator:
  version: 1
covers:
  - symbol: InsightFishing
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx:L18-L114
  - symbol: InsightGapsDetails
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightGapsDetails.tsx:L20-L69
  - symbol: InsightLongline
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L37-L149
  - symbol: onShowOnMapClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L86-L91
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L93-L104
  - symbol: removeNonTunaRFMO
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/insights.utils.ts:L7-L16'
---

<!-- context:generated:start -->

## Summary

Utility pattern filtering vessel activity events to retain only tuna-specific Regional Fisheries Management Organization (RFMO) zones: CCSBT, IATTC, ICCAT, IOTC, NPFC, SPRFMO, WCPFC. Applied before rendering or exporting fishing and longline events to focus insights on tuna fishery management areas.

## Related

- part of [[vessel-insights-display-system]] — Tuna RFMO filtering is applied across all fishing-related insight displays

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
