---
name: Concurrent Request Deduplication & Retry Logic
slug: concurrent-request-deduplication-retry-logic
type: concept
sources:
  - path: apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts
    hash: 806ef52d3c6ef2c406917adad16af0e74b98641846eb0b1e5cb3b4f8660fa6cf
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts
    hash: cb4416adc7b696f43625e083c3a7e6c259b1688d13de387ea019adf92f19e15f
sources_digest: 79fd0cced3ae68c7bb18539c6736a8a52004496e627c8556bd260fac1e0d5bed
links:
  - to: vessel-groups-management-system
    relation: part_of
    description: >-
      Deduplication and retry patterns are embedded in thunk conditions and
      error handlers
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
  - symbol: IdField
    kind: type
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L19-L28'
  - symbol: VesselGroupsState
    kind: interface
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L30-L35'
  - symbol: VesselGroupSliceState
    kind: type
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L44-L44'
  - symbol: UpdateVesselGroupThunkParams
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L137-L140
  - symbol: saveVesselGroup
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L209-L239
  - symbol: extraReducers
    kind: method
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L279-L298
  - symbol: selectVesselGroupsStatus
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L317-L317
  - symbol: selectVesselGroupsError
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L318-L318
  - symbol: selectWorkspaceVesselGroupsStatus
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L319-L320
  - symbol: selectWorkspaceVesselGroupsError
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L322-L323
  - symbol: selectVesselGroupsStatusId
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts:L324-L325
---

<!-- context:generated:start -->

## Summary

vessel-groups thunks use the `condition` option to prevent concurrent fetches of the same resource. createVesselGroupThunk retries on 422 duplicate-name errors by appending timestamp to name. Vessel search in modal.slice paginates via SEARCH_PAGINATION (50 items) using `since` token and merges results. getVesselInVesselGroupThunk falls back to search endpoint if datasets are outdated (via runDatasetMigrations).

## Related

- part of [[vessel-groups-management-system]] — Deduplication and retry patterns are embedded in thunk conditions and error handlers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
