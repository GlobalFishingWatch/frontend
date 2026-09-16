---
name: Temporal Data & Versioning Constraints
slug: temporal-data-versioning-constraints
type: concept
sources:
  - path: libs/api-types/src/datasets.configuration.ts
    hash: 52e528466dcd5fe08a078b4943717b67c6dcee7269e8bfce879ddfbfc52bfe86
  - path: libs/api-types/src/datasets.ts
    hash: f1367de65d32bc89e6997cc3333fcef0bd1cf6392f369a9945211836325d1d6e
  - path: libs/api-types/src/events.ts
    hash: 9c7da1a5a7b2e3fb22224195e0b2b0150ca311666ef66916d3e57d580db38b57
  - path: libs/api-types/src/identity-vessel.ts
    hash: 7b6b9ac2c0480dfe47e46c022ff135c8487161b3325980ff375f30b70e0493f6
sources_digest: 21749e87d4c205c43d03f40d32b21f0c7cda1126905b29c692d97a2d67dd9cd1
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Temporal design patterns recur across dataset, event, and vessel identity
      modules
generator:
  version: 1
covers:
  - symbol: DatasetTypes
    kind: enum
    at: 'libs/api-types/src/datasets.configuration.ts:L1-L16'
  - symbol: ApiSupportedVersions
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L18-L18'
  - symbol: ContextLayerFormat
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L20-L20'
  - symbol: ContextLayerV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L22-L24'
  - symbol: UserContextLayerV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L26-L32'
  - symbol: UserFourwingsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L34-L46'
  - symbol: TemporalContextLayerV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L48-L48'
  - symbol: UserTracksV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L50-L53'
  - symbol: PmTilesV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L55-L58'
  - symbol: AggregationFunction
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L60-L60'
  - symbol: EventsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L61-L64'
  - symbol: FourwingsInterval
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L66-L66'
  - symbol: FourwingsPositionProperty
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L67-L67'
  - symbol: FourwingsPositionProperties
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L68-L71'
  - symbol: FourwingsReportGrouping
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L73-L73'
  - symbol: FourwingsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L74-L82'
  - symbol: TracksV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L84-L84'
  - symbol: VesselsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L86-L86'
  - symbol: InsightSource
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L88-L88'
  - symbol: InsightsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L90-L92'
  - symbol: BulkDownloadFormat
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L94-L94'
  - symbol: BulkDownloadV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L95-L95'
  - symbol: DataDownloadDatasetFile
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L97-L102'
  - symbol: DataDownloadV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L103-L110'
  - symbol: ThumbnailsV1Configuration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L112-L114'
  - symbol: DatasetConfigurationByType
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L116-L132'
  - symbol: TimeFilterType
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L134-L134'
  - symbol: DatasetConfigurationSourceFormat
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L135-L136'
  - symbol: DatasetGeometryType
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L138-L138'
  - symbol: DatasetGeometryToGeoJSONGeometry
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L139-L141'
  - symbol: FrontendConfiguration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L142-L163'
  - symbol: SharedDatasetConfiguration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L165-L168'
  - symbol: DatasetTypeToConfigurationType
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L185-L185'
  - symbol: GetConfigurationType
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L187-L188'
  - symbol: DatasetConfiguration
    kind: type
    at: 'libs/api-types/src/datasets.configuration.ts:L190-L199'
  - symbol: UploadResponse
    kind: type
    at: 'libs/api-types/src/datasets.ts:L10-L13'
  - symbol: DatasetType
    kind: type
    at: 'libs/api-types/src/datasets.ts:L15-L15'
  - symbol: DatasetStatus
    kind: enum
    at: 'libs/api-types/src/datasets.ts:L17-L22'
  - symbol: DatasetDocumentationTypes
    kind: type
    at: 'libs/api-types/src/datasets.ts:L24-L25'
  - symbol: DatasetDocumentationStatusTypes
    kind: enum
    at: 'libs/api-types/src/datasets.ts:L27-L30'
  - symbol: DatasetDocumentation
    kind: type
    at: 'libs/api-types/src/datasets.ts:L32-L38'
  - symbol: DatasetConfigurationInterval
    kind: type
    at: 'libs/api-types/src/datasets.ts:L40-L40'
  - symbol: RelatedDataset
    kind: type
    at: 'libs/api-types/src/datasets.ts:L42-L45'
  - symbol: DatasetCategory
    kind: enum
    at: 'libs/api-types/src/datasets.ts:L47-L55'
  - symbol: DatasetCategories
    kind: type
    at: 'libs/api-types/src/datasets.ts:L57-L57'
  - symbol: DatasetSubCategory
    kind: enum
    at: 'libs/api-types/src/datasets.ts:L59-L85'
  - symbol: DatasetSubCategories
    kind: type
    at: 'libs/api-types/src/datasets.ts:L87-L87'
  - symbol: DatasetFile
    kind: type
    at: 'libs/api-types/src/datasets.ts:L89-L94'
  - symbol: DatasetI18nFilter
    kind: type
    at: 'libs/api-types/src/datasets.ts:L96-L99'
  - symbol: DatasetI18nFilters
    kind: type
    at: 'libs/api-types/src/datasets.ts:L100-L100'
  - symbol: DatasetI18n
    kind: type
    at: 'libs/api-types/src/datasets.ts:L102-L106'
  - symbol: Dataset
    kind: type
    at: 'libs/api-types/src/datasets.ts:L108-L134'
  - symbol: DownloadDataset
    kind: type
    at: 'libs/api-types/src/datasets.ts:L136-L145'
  - symbol: PointCoordinate
    kind: type
    at: 'libs/api-types/src/events.ts:L1-L4'
  - symbol: RegionType
    kind: enum
    at: 'libs/api-types/src/events.ts:L6-L13'
  - symbol: Regions
    kind: type
    at: 'libs/api-types/src/events.ts:L15-L22'
  - symbol: GapPosition
    kind: type
    at: 'libs/api-types/src/events.ts:L24-L26'
  - symbol: EventTypes
    kind: enum
    at: 'libs/api-types/src/events.ts:L28-L35'
  - symbol: EventType
    kind: type
    at: 'libs/api-types/src/events.ts:L37-L37'
  - symbol: EventNextPort
    kind: type
    at: 'libs/api-types/src/events.ts:L39-L44'
  - symbol: EventVesselTypeEnum
    kind: enum
    at: 'libs/api-types/src/events.ts:L46-L49'
  - symbol: AuthorizationType
    kind: type
    at: 'libs/api-types/src/events.ts:L51-L51'
  - symbol: EventAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L53-L56'
  - symbol: EventVesselAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L58-L61'
  - symbol: EventVessel
    kind: type
    at: 'libs/api-types/src/events.ts:L63-L72'
  - symbol: RFMOs
    kind: type
    at: 'libs/api-types/src/events.ts:L74-L75'
  - symbol: EncounterEventAuthorizations
    kind: type
    at: 'libs/api-types/src/events.ts:L77-L84'
  - symbol: AuthorizationOptions
    kind: enum
    at: 'libs/api-types/src/events.ts:L86-L90'
  - symbol: EncounterEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L92-L117'
  - symbol: LoiteringEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L119-L124'
  - symbol: PortEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L126-L132'
  - symbol: Anchorage
    kind: type
    at: 'libs/api-types/src/events.ts:L134-L144'
  - symbol: PortVisitEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L146-L153'
  - symbol: GapEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L155-L167'
  - symbol: GapsEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L169-L174'
  - symbol: FishingEventDayNightCategory
    kind: type
    at: 'libs/api-types/src/events.ts:L176-L176'
  - symbol: LonglineFishingFields
    kind: type
    at: 'libs/api-types/src/events.ts:L179-L186'
  - symbol: FishingEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L188-L192'
  - symbol: Distances
    kind: type
    at: 'libs/api-types/src/events.ts:L194-L199'
  - symbol: ApiEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L201-L220'
  - symbol: ApiEvents
    kind: type
    at: 'libs/api-types/src/events.ts:L222-L226'
  - symbol: VesselType
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L1-L10'
  - symbol: GearType
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L23-L53'
  - symbol: VesselIdentitySourceEnum
    kind: enum
    at: 'libs/api-types/src/identity-vessel.ts:L87-L92'
  - symbol: SelfReportedSource
    kind: enum
    at: 'libs/api-types/src/identity-vessel.ts:L94-L111'
  - symbol: VesselInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L113-L127'
  - symbol: VesselTMTInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L129-L138'
  - symbol: SelfReportedMatchFields
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L140-L140'
  - symbol: RegistryLoginMessage
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L143-L143'
  - symbol: SelfReportedInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L145-L166'
  - symbol: RegistryImage
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L168-L171'
  - symbol: RegistryExtraFieldValue
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L173-L179'
  - symbol: RegistryExtraFields
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L181-L190'
  - symbol: VesselRegistryInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L192-L202'
  - symbol: VesselRegistryProperty
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L204-L210'
  - symbol: VesselRegistryOwner
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L212-L215'
  - symbol: VesselRegistryOperator
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L217-L220'
  - symbol: VesselRegistryAuthorization
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L222-L222'
  - symbol: VesselIdentitySearchMatch
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L224-L227'
  - symbol: VesselIdentitySearchMatchCriteria
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L229-L239'
  - symbol: CombinedSourceInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L241-L248'
  - symbol: VesselCombinedSourcesInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L249-L268'
  - symbol: IdentityVessel
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L270-L280'
---

<!-- context:generated:start -->

## Summary

String-based timestamps throughout api-types (datasets.ts start/end, events.ts ApiEvent timestamps) defer parsing logic to consuming layers, trading type safety for schema flexibility. All configurations reference v1 APIs with single supported version v3 (datasets.configuration), requiring careful coordination when introducing new dataset types or API versions. StartEndValue arrays capture evolving attributes across time periods; CombinedSourceInfo aggregates conflicting vessel data with temporal boundaries to enable provenance tracking.

## Related

- part of [[api-types-type-definitions]] — Temporal design patterns recur across dataset, event, and vessel identity modules

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
