---
name: CSV Vessel Import & Column Validation
slug: csv-vessel-import-column-validation
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts
    hash: 806ef52d3c6ef2c406917adad16af0e74b98641846eb0b1e5cb3b4f8660fa6cf
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.config.ts
    hash: c2c9f6c28eadf1b58aee8c2a89dece3bff256772d28168d4e1f5777f366d994d
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.selectors.ts
    hash: e4b2ab70512a2857144867a0f02087ebac4b38cea060c1609c211d316fe75c7c
sources_digest: 9fd640cb6edb14ee2ce3423735595d631f333230b8f643755ba58d4e905f7e12
links:
  - to: vessel-groups-management-system
    relation: part_of
    description: CSV validation is part of vessel group modal import workflow
generator:
  version: 1
covers:
  - symbol: VesselGroupConfirmationMode
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L47-L47
  - symbol: VesselGroupCsvData
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L49-L49
  - symbol: VesselGroupModalState
    kind: interface
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L50-L66
  - symbol: SearchVesselsBody
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L68-L74
  - symbol: FetchSearchVessels
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L75-L75
  - symbol: fetchSearchVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L77-L94
  - symbol: getAllSearchVesselsUrl
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L97-L115
  - symbol: fetchAllSearchVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L116-L130
  - symbol: SearchVesselsInVGParams
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L132-L141
  - symbol: ParsedSearchInput
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L143-L145
  - symbol: searchVesselsInVesselGroup
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L147-L239
  - symbol: resolveSearchProperty
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L173-L180
  - symbol: normalizeMatchValue
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L241-L248
  - symbol: getUnmatchedInputs
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L250-L270
  - symbol: GetVesselsInVGParams
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L272-L276
  - symbol: getVesselsInVesselGroup
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L277-L314
  - symbol: extraReducers
    kind: method
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L483-L516
  - symbol: selectVesselGroupModalOpen
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L535-L535
  - symbol: selectVesselGroupModalSearchIdField
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L536-L537
  - symbol: selectVesselGroupModalCsvColumns
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L538-L539
  - symbol: selectVesselGroupModalCsvData
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L540-L541
  - symbol: selectVesselGroupModalUnmatchedIDs
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L542-L543
  - symbol: selectVesselGroupSearchStatus
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L544-L545
  - symbol: selectVesselGroupModalSources
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L546-L546
  - symbol: selectVesselGroupModalName
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L547-L547
  - symbol: selectVesselGroupModalVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L548-L548
  - symbol: selectVesselGroupsModalSearchText
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L549-L550
  - symbol: selectVesselGroupEditId
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L551-L552
  - symbol: selectVesselGroupConfirmationMode
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts:L553-L554
---

<!-- context:generated:start -->

## Summary

vessel-groups-modal.slice accepts CSV data with column mapping. ID_COLUMN_LOOKUP (mmsi, imo, vesselId, flag order) guides preferred column detection; normaliseCsvColumns resolves user-provided column names via resolveVesselPropertyColumn from @globalfishingwatch/data-transforms. selectVesselGroupModalSelectableColumns validates flag (ISO3), mmsi (SSVID_LENGTH), vesselId (VESSEL_ID_LENGTH, authenticated-only), imo, callsign. CSV column names are stripped of dangerous characters and normalized for whitespace/accents.

## Related

- part of [[vessel-groups-management-system]] — CSV validation is part of vessel group modal import workflow

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
