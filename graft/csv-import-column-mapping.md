---
name: CSV Import & Column Mapping
slug: csv-import-column-mapping
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/VesselGroupModalSearch.tsx
    hash: b8285b469648c38e2e648da276b74b0e41936aa57ff98ae4536d2a63602e2c30
sources_digest: 30cf37786681373e5f559624bde9bbe22360c5bffae7fdcf4c72bf61471b5b6d
links:
  - to: vessel-groups-ui-layer
    relation: uses
    description: >-
      VesselGroupModalSearch integrates FileDropzone and CSV parsing; dispatches
      setVesselGroupModalCsvData and setVesselGroupModalCsvColumns to Redux;
      getDatasetsIdFieldOptions populates column selector
generator:
  version: 1
covers:
  - symbol: VesselGroupSearch
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/VesselGroupModalSearch.tsx:L41-L255
---

<!-- context:generated:start -->

## Summary

Users upload CSV files containing vessel identifiers, with configurable column selection to extract ID fields (SSVID, IMO, callsign, etc.). CSV parsing via PapaParse, preview limited to 100 rows for performance. Column validation ensures required fields are present before search execution.

## Related

- uses [[vessel-groups-ui-layer]] — VesselGroupModalSearch integrates FileDropzone and CSV parsing; dispatches setVesselGroupModalCsvData and setVesselGroupModalCsvColumns to Redux; getDatasetsIdFieldOptions populates column selector

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
