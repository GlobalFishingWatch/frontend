---
name: Dataset & Dataview Integration
slug: dataset-dataview-integration
type: concept
sources:
  - path: apps/platform/features/_user/UserWorkspacesPublic.tsx
    hash: a7570558dcf01ee4ed744c0a7c5ce0d74f36728796cd1025bcfbf9afea4cb97a
  - path: >-
      apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts
    hash: 2fd47c1f3f0875902e8ef322d37b9358b9e2adb3960c485cfe8303b121c4123b
  - path: apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts
    hash: 806ef52d3c6ef2c406917adad16af0e74b98641846eb0b1e5cb3b4f8660fa6cf
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.selectors.ts
    hash: e4b2ab70512a2857144867a0f02087ebac4b38cea060c1609c211d316fe75c7c
  - path: apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts
    hash: 8548cf55ec5312665e491dbefbf6d4ef359ee33cf83c599e9450cd751b9fb6c6
sources_digest: c0b0481bebd121e1ea7cb3d88d4d02af5eafd4a03dca1a97cdb9a262a6577d1f
links:
  - to: vessel-groups-management-system
    relation: part_of
    description: >-
      Dataset validation and migration logic is embedded in vessel groups
      workflows
generator:
  version: 1
covers:
  - symbol: UserWorkspacesPublic
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPublic.tsx:L29-L156'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_user/UserWorkspacesPublic.tsx:L66-L68'
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

Vessel groups and workspace management depend on dataset availability and deprecation status. Datasets are searched for vessel identity fields (MMSI, IMO, VMS shipname) via API endpoints; deprecated datasets trigger warnings and migrations. VMS datasets use 'shipname' as primary identity field; other datasets use MMSI. Dataset endpoints are resolved via @globalfishingwatch/data-transforms schema resolution.

## Related

- part of [[vessel-groups-management-system]] — Dataset validation and migration logic is embedded in vessel groups workflows

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
