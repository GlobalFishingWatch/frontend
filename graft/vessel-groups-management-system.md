---
name: Vessel Groups Management System
slug: vessel-groups-management-system
type: system
sources:
  - path: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts
    hash: 2fd47c1f3f0875902e8ef322d37b9358b9e2adb3960c485cfe8303b121c4123b
  - path: apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts
    hash: 806ef52d3c6ef2c406917adad16af0e74b98641846eb0b1e5cb3b4f8660fa6cf
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.config.ts
    hash: c2c9f6c28eadf1b58aee8c2a89dece3bff256772d28168d4e1f5777f366d994d
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts
    hash: 1199a53336ff6c892de11a6aff6d53001e10e3d50fb5f8a8a48e0ddfac65a2e0
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.selectors.ts
    hash: e4b2ab70512a2857144867a0f02087ebac4b38cea060c1609c211d316fe75c7c
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.slice.ts
    hash: cb4416adc7b696f43625e083c3a7e6c259b1688d13de387ea019adf92f19e15f
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.types.ts
    hash: 6c4e544b651224bec4cac248bb8b9b67ec96b504d1a7770a1555453130773bcf
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts
    hash: 8548cf55ec5312665e491dbefbf6d4ef359ee33cf83c599e9450cd751b9fb6c6
sources_digest: 3f756d67dda5a12ea6adc60deeed1064b72ebadb96a9fa27cec9eb2640e92a2a
links:
  - to: dataset-dataview-integration
    relation: depends_on
    description: >-
      vessel-groups-modal.slice validates ID fields against dataset endpoints;
      vessel-groups-migration.hooks checks selectDeprecatedDatasets and
      selectDeletedDatasets to trigger migrations; vessel-groups.hooks uses
      PRESENCE_DATAVIEW_SLUG for activity fallback
  - to: user-authorization-permissions-system
    relation: depends_on
    description: >-
      Vessel group selectors validate GFW vessel IDs require authenticated
      users; creation respects user permissions via selectUserVesselGroups
      filter
  - to: user-profile-settings-panel
    relation: depends_on
    description: >-
      UserVesselGroups displays and manages groups via selectUserVesselGroups,
      deleteVesselGroupThunk, and useMigrateToLatestVesselGroup
generator:
  version: 1
covers:
  - symbol: getVesselGroupDatasetStatus
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts:L40-L55
  - symbol: useVesselGroupDatasetStatus
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts:L57-L69
  - symbol: AddVesselGroupVessel
    kind: type
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts:L75-L76
  - symbol: useMigrateToLatestVesselGroup
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts:L78-L134
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
  - symbol: useVesselGroupDataviewInstance
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts:L36-L52'
  - symbol: useVesselGroupsOptions
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts:L54-L71'
  - symbol: useVesselGroupsUpdate
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts:L73-L92'
  - symbol: useVesselGroupsModal
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts:L94-L112'
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
  - symbol: VesselGroupVesselIdentity
    kind: type
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.types.ts:L6-L6'
  - symbol: AddVesselGroupVessel
    kind: type
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.types.ts:L8-L9'
  - symbol: getVesselGroupLabel
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L33-L36'
  - symbol: VesselPropertyApiSearch
    kind: type
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L43-L45'
  - symbol: vesselPropertyToApiSearch
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L47-L54'
  - symbol: isIdFieldSupportedByDataset
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L56-L63'
  - symbol: getDatasetsIdFieldOptions
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L66-L80'
  - symbol: normaliseCsvColumns
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L82-L88'
  - symbol: isOutdatedVesselGroup
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L90-L95'
  - symbol: getVesselGroupVesselsCount
    kind: function
    at: 'apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L97-L103'
  - symbol: removeDuplicatedVesselGroupvessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L105-L107
  - symbol: removeVesselGroupvesselIdentity
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L108-L111
  - symbol: prepareVesselGroupVesselsUpdate
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L112-L114
  - symbol: getVesselGroupUniqVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L116-L141
  - symbol: groupVesselGroupVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L143-L161
  - symbol: mergeVesselGroupVesselIdentities
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L163-L204
  - symbol: flatVesselGroupSearchVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L206-L225
  - symbol: parseVesselGroupVessels
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L227-L255
  - symbol: getVesselsWithoutDuplicates
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L257-L262
  - symbol: calculateVMSVesselsPercentage
    kind: function
    at: >-
      apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts:L264-L291
---

<!-- context:generated:start -->

## Summary

Manages fishing vessel collections across datasets with CRUD operations, dataset migration, vessel identity reconciliation, and CSV import. Core Redux slice (vessel-groups.slice) handles API CRUD with retry logic for naming conflicts; modal slice (vessel-groups-modal.slice) orchestrates vessel search/validation; utilities normalize CSV data and reconcile identities from multiple sources; selectors validate ID fields and resolve constraints.

## Related

- depends on [[dataset-dataview-integration]] — vessel-groups-modal.slice validates ID fields against dataset endpoints; vessel-groups-migration.hooks checks selectDeprecatedDatasets and selectDeletedDatasets to trigger migrations; vessel-groups.hooks uses PRESENCE_DATAVIEW_SLUG for activity fallback
- depends on [[user-authorization-permissions-system]] — Vessel group selectors validate GFW vessel IDs require authenticated users; creation respects user permissions via selectUserVesselGroups filter
- depends on [[user-profile-settings-panel]] — UserVesselGroups displays and manages groups via selectUserVesselGroups, deleteVesselGroupThunk, and useMigrateToLatestVesselGroup

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
