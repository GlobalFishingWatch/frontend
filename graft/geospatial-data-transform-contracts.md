---
name: Geospatial Data Transform Contracts
slug: geospatial-data-transform-contracts
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.permissions.ts
    hash: 76a310bad2263011556ef0dc49fa7b420b1047ed7c0391c25e5de5c57e99d773
  - path: apps/platform/features/_map/datasets/datasets.selectors.ts
    hash: 2dba31ceeeb77270b13479ca9fc6778107625da3934b0039a5be714266cd5c7e
  - path: apps/platform/features/_map/datasets/datasets.slice.ts
    hash: af8ff6cca5a9256bdd3666a0816fa59ca68e9f81ddfe58c85c6ab5981d16d343
  - path: apps/platform/features/_map/datasets/datasets.utils.ts
    hash: fd774034bb07f6545ab88bbc29df144b51bdbf4a8d2f0249e8dae9ea439a49fc
  - path: apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts
    hash: e1d1529faf3dd1869bc953ed7a616fa229cba12686b125e55dfbd1de786c5427
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx
    hash: 44fb021ae09c0e5998db5ba705db09cb4474182f21c8325355ff03338956176e
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts
    hash: 377e35f85ab80721d794200c748a7ac847550158b04b573114d0bcc5afeb5242
  - path: apps/platform/features/_map/dataviews/dataviews.filters.ts
    hash: 87f7c755d567b431f513138669a98f84ebe8fa8a62f92deaa0dc10756cb58c35
  - path: apps/platform/features/_map/dataviews/dataviews.slice.ts
    hash: 3ce12eff9e186ff0e1c8741b79764b67cd0a38eef0ca2e5ad0d4e46152059de0
  - path: apps/platform/features/_map/dataviews/dataviews.utils.ts
    hash: 1acbece36e7e4d41d78302c72bdc83ac385c7a9dc737cbf28d856201dae18c19
sources_digest: 9faab098a9ed7a1ff8e44826d13b18087566fc4828953ea75bae9253770689e5
links: []
generator:
  version: 1
covers:
  - symbol: hasDatasetConfigVesselData
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L11-L17'
  - symbol: getActivityDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L19-L41'
  - symbol: getVesselDatasetsDownloadTrackSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L43-L57'
  - symbol: getDatasetsReportSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L59-L68'
  - symbol: getDatasetsReportNotSupported
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.permissions.ts:L70-L79'
  - symbol: selectDatasetsByType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.selectors.ts:L17-L32'
  - symbol: getAPILocale
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L37-L41'
  - symbol: DatasetsState
    kind: interface
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L43-L46'
  - symbol: DatasetsSliceState
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L48-L48'
  - symbol: FetchUserDatasetsMode
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L83-L83'
  - symbol: FetchDatasetsBatchParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L85-L93'
  - symbol: fetchDatasetsBatch
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L95-L187'
  - symbol: fetchDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L119-L139'
  - symbol: FetchAllDatasetsParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L307-L308'
  - symbol: getAllDatasetsRequestKey
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L311-L314'
  - symbol: UpsertDataset
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L339-L344'
  - symbol: selectDatasetsStatus
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L533-L533'
  - symbol: selectDatasetsStatusId
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L534-L534'
  - symbol: selectDatasetsError
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L535-L535'
  - symbol: selectSliceDeprecatedDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L536-L537'
  - symbol: selectDeletedDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.slice.ts:L538-L538'
  - symbol: VesselInstanceDatasets
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L35-L42'
  - symbol: getVesselTrackDatasetIds
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L44-L57'
  - symbol: bySubcategory
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L51-L52'
  - symbol: isPrivateDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L66-L67'
  - symbol: isPrivateVesselGroup
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L69-L70'
  - symbol: isGFWOnlyDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L77-L78'
  - symbol: getIsSkylightDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L80-L81'
  - symbol: isRealTimeDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L83-L85'
  - symbol: GetDatasetLabelParams
    kind: type
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L89-L89'
  - symbol: getDatasetLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L90-L97'
  - symbol: getDatasetMatchesSearch
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L99-L106'
  - symbol: getDataviewsSources
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L108-L117'
  - symbol: getDatasetTypeIcon
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L119-L139'
  - symbol: getIsBQEditorDataset
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L140-L149'
  - symbol: warnMissingGeometryType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L152-L158'
  - symbol: groupDatasetsByGeometryType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L160-L190'
  - symbol: getGeometryTypeLabel
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L192-L207'
  - symbol: getDatasetSourceIcon
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L209-L235'
  - symbol: getDatasetTitleByDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L237-L293'
  - symbol: getDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L295-L326'
  - symbol: getDatasetsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L328-L343'
  - symbol: getVesselGroupInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L345-L351'
  - symbol: getVesselGroupsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L353-L364'
  - symbol: getActiveDatasetsInActivityDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L366-L372'
  - symbol: getLatestEndDateFromDatasets
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L374-L379'
  - symbol: getActiveDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L381-L396'
  - symbol: getActiveActivityDatasetsInDataviews
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L398-L407'
  - symbol: getEventsDatasetsInDataview
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L409-L423'
  - symbol: filterDatasetsByUserType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.utils.ts:L425-L438'
  - symbol: DataList
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L41-L41
  - symbol: GriddedData
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L42-L42
  - symbol: DatasetParsedByType
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L43-L48
  - symbol: DataParsed
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L49-L49
  - symbol: validateFeatures
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L59-L119
  - symbol: validatedGeoJSON
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L121-L124
  - symbol: getDatasetParsed
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L126-L189
  - symbol: getTrackFromList
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L191-L206
  - symbol: getGeojsonFromPointsList
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L208-L225
  - symbol: getNormalizedGeojsonFromPointsGeojson
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-parse.utils.ts:L227-L235
  - symbol: useDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L21-L69
  - symbol: FieldOption
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L72-L72
  - symbol: useDatasetMetadataOptions
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L73-L177
  - symbol: getDatasetMetadataValidations
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L45-L56
  - symbol: ExtractMetadataProps
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L58-L62
  - symbol: getMetadataFromDataset
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L64-L76
  - symbol: getBaseDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L78-L96
  - symbol: getTracksDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L98-L117
  - symbol: getPointsDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L119-L145
  - symbol: GriddedSourceFormat
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L147-L147
  - symbol: getGriddedDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L149-L178
  - symbol: getPolygonsDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L180-L209
  - symbol: getFinalDatasetFromMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L211-L242
  - symbol: getPropertiesIdClean
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L244-L255
  - symbol: parseGeoJsonProperties
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.utils.ts:L256-L306
  - symbol: FilterCompatibilityOperation
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L38-L38'
  - symbol: FilterOriginParam
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L40-L40'
  - symbol: GetFiltersInDataviewParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L41-L47'
  - symbol: DataviewWithFilters
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L49-L50'
  - symbol: getIncompatibleFilterSelection
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L52-L90'
  - symbol: isDataviewFilterSupported
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L92-L106'
  - symbol: getDatasetI18nFilter
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L108-L110'
  - symbol: getFilterLabel
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L112-L130'
  - symbol: getFilterEnumLabel
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L132-L139'
  - symbol: getSupportedFilterDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L141-L151'
  - symbol: getNotSupportedFilterDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L153-L166'
  - symbol: getCommonFilterTypeInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L168-L177'
  - symbol: DataviewFilterSelection
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L179-L182'
  - symbol: getCommonFiltersInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L184-L282'
  - symbol: getFilterOptionsSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L284-L345'
  - symbol: format
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L312-L313'
  - symbol: getFiltersSelectedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L347-L355'
  - symbol: getFilterOperationInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L357-L365'
  - symbol: getFilterUnitInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L367-L372'
  - symbol: getIsFilterSingleSelection
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L374-L380'
  - symbol: getFilterOperation
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L382-L385'
  - symbol: DataviewFilterConfig
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L386-L397'
  - symbol: getDataviewFilterConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L399-L449'
  - symbol: getFiltersInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.filters.ts:L451-L495'
  - symbol: normalizeDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L52-L55'
  - symbol: DataviewsState
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L142-L142'
  - symbol: DataviewsSliceState
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L143-L143'
  - symbol: selectDataviewBySlug
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.slice.ts:L168-L172'
  - symbol: dataviewHasVesselGroupId
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L88-L90'
  - symbol: getContextDataviewDataset
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L93-L100'
  - symbol: dataviewHasUserTimeRange
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L102-L110'
  - symbol: GetVesselInWorkspaceParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L112-L116'
  - symbol: getVesselDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L118-L136'
  - symbol: getHasVesselProfileInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L138-L148'
  - symbol: getVesselInfoDataviewInstanceDatasetConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L150-L170'
  - symbol: getVesselDataviewInstanceDatasetConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L172-L208'
  - symbol: resolveVesselTrackConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L212-L236'
  - symbol: resolveVesselDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L238-L268'
  - symbol: withLonglineSetsEvents
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L272-L310'
  - symbol: isFishingEventsConfig
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L276-L278'
  - symbol: VesselDataviewInstanceTemplateParams
    kind: type
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L312-L320'
  - symbol: vesselDataviewInstanceTemplate
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L322-L352'
  - symbol: getBestVesselTemplateSlug
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L355-L370'
  - symbol: findTemplate
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L361-L364'
  - symbol: getVesselDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L372-L411'
  - symbol: getVesselEncounterTrackDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L413-L456'
  - symbol: getUserPolygonsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L458-L475'
  - symbol: getUserPointsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L477-L513'
  - symbol: getUserFourwingsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L515-L541'
  - symbol: getUserTrackDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L543-L560'
  - symbol: getContextDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L562-L579'
  - symbol: getDataviewInstanceFromDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L581-L586'
  - symbol: getBigQuery4WingsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L588-L615'
  - symbol: getBigQueryEventsDataviewInstance
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L617-L634'
  - symbol: dataviewWithPrivateDatasets
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L636-L639'
  - symbol: isBathymetryDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L641-L646'
  - symbol: isBathymetryContourDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L648-L650'
  - symbol: getIsPositionSupportedInDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L652-L664'
  - symbol: hasVesselGroupDatasetsDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L666-L674'
  - symbol: hasVesselGroupDatasetsDeleted
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L676-L684'
  - symbol: isDataviewDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L686-L724'
  - symbol: isRealTimeActivityDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L733-L738'
  - symbol: isRealTimeDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L740-L745'
  - symbol: isHistoricalDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L747-L752'
  - symbol: hasWorkspaceDataviewsDeprecated
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.utils.ts:L754-L766'
---

<!-- context:generated:start -->

## Summary

Shared type and configuration interfaces from @globalfishingwatch/api-types, @globalfishingwatch/datasets-client, @globalfishingwatch/dataviews-client, and @globalfishingwatch/data-transforms that define dataset schemas (filters, properties, geometry types), dataview structures (categories, sources, filters), and file parsing contracts. All dataset and dataview management code depends on these contracts for introspection and validation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
