---
name: Discriminated Union Type Safety via Generics
slug: discriminated-union-type-safety-via-generics
type: concept
sources:
  - path: libs/api-types/src/datasets.ts
    hash: f1367de65d32bc89e6997cc3333fcef0bd1cf6392f369a9945211836325d1d6e
  - path: libs/api-types/src/dataviews.ts
    hash: 8ac5cf4407cfdd56198a347dbe8dd3b5e60c74f10521bda4772fcab13a88459b
  - path: libs/api-types/src/events.ts
    hash: 9c7da1a5a7b2e3fb22224195e0b2b0150ca311666ef66916d3e57d580db38b57
  - path: libs/api-types/src/resources.ts
    hash: e0d07ffaff979658a6e389f98413ca023731021c6737c92f28a0d7c3b687507f
sources_digest: b2aeb809048dfe3b9be87b9ae52e63102a88492343aba346269f46104f9199ca
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Discriminated unions are foundational patterns throughout the api-types
      library
generator:
  version: 1
covers:
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
  - symbol: ColorCyclingType
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L6-L6'
  - symbol: FilterOperator
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L9-L9'
  - symbol: FilterOperators
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L10-L10'
  - symbol: DataviewType
    kind: enum
    at: 'libs/api-types/src/dataviews.ts:L13-L45'
  - symbol: DataviewContexLayerConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L47-L50'
  - symbol: FourwingsGeolocation
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L52-L52'
  - symbol: ClusterMaxZoomLevelConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L55-L55'
  - symbol: DataviewConfigVessel
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L57-L82'
  - symbol: DataviewConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L84-L169'
  - symbol: DataviewDatasetConfigParam
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L171-L174'
  - symbol: DataviewDatasetFilter
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L178-L178'
  - symbol: DatasetsMigration
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L179-L179'
  - symbol: DataviewDatasetConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L180-L187'
  - symbol: DataviewCreation
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L189-L195'
  - symbol: DataviewInfoConfigField
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L197-L202'
  - symbol: DataviewInfoConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L204-L206'
  - symbol: DataviewEventsConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L208-L212'
  - symbol: IncomatibleFilterConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L214-L219'
  - symbol: DataviewFiltersConfig
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L221-L225'
  - symbol: DataviewCategory
    kind: enum
    at: 'libs/api-types/src/dataviews.ts:L228-L244'
  - symbol: Dataview
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L247-L265'
  - symbol: DataviewInstanceOrigin
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L267-L267'
  - symbol: DataviewInstance
    kind: type
    at: 'libs/api-types/src/dataviews.ts:L270-L279'
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
  - symbol: ResourceResponseType
    kind: type
    at: 'libs/api-types/src/resources.ts:L4-L5'
  - symbol: ResourceRequestType
    kind: type
    at: 'libs/api-types/src/resources.ts:L7-L7'
  - symbol: ResourceStatus
    kind: enum
    at: 'libs/api-types/src/resources.ts:L9-L15'
  - symbol: Resource
    kind: type
    at: 'libs/api-types/src/resources.ts:L17-L27'
---

<!-- context:generated:start -->

## Summary

Core design pattern enabling strict type narrowing across the API type system. Dataset<T> conditionally selects configuration shape from DatasetTypeToConfigurationType; DataviewInstance uses DataviewType to determine layer rendering class; EventVessel and ApiEvent use generic type parameters for serialization polymorphism. Allows consumers to get precise type information when a specific type is known while supporting generic handling, enforced at compile-time rather than runtime.

## Related

- part of [[api-types-type-definitions]] — Discriminated unions are foundational patterns throughout the api-types library

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
