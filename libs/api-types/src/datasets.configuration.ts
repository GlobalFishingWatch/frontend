import { DatasetTypes } from './datasets'

export type ApiSupportedVersions = 'v3'

export type ContextLayerFormat = 'GEOJSON' | 'PMTILE' | 'CSV'

export type ContextLayerV1Configuration = {
  idProperty?: string
}

export type UserContextLayerV1Configuration = {
  filePath?: string
  format?: ContextLayerFormat
  idProperty?: string
  valuePropertyId?: string
  importLogs?: string
}

export type TemporalContextLayerV1Configuration = {}

export type UserTracksV1Configuration = {
  filePath?: string
  idProperty?: string
}

export type PmTilesV1Configuration = {
  filePath?: string
  idProperty?: string
}

export type AggregationFunction = 'AVG' | 'SUM'
export type EventsV1Configuration = {
  function?: AggregationFunction
  maxZoom?: number
}

export type FourwingsInterval = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR'
export type FourwingsPositionProperty = 'bearing' | 'speed' | 'shipname' | 'vessel_id'
export type FourwingsPositionProperties = {
  id: FourwingsPositionProperty
  type: string | number
}
export type FourwingsV1Configuration = {
  function?: AggregationFunction
  intervals?: FourwingsInterval[]
  max?: number
  maxZoom?: number
  min?: number
  extraPropertiesPositionTiles?: FourwingsPositionProperties[]
}

export type TracksV1Configuration = {}

export type VesselsV1Configuration = {}

export type InsightSource = {}

export type InsightsV1Configuration = {
  sources?: InsightSource[]
}

export type BulkDownloadFormat = 'CSV' | 'JSON'
export type BulkDownloadV1Configuration = {}

export type DataDownloadDatasetFile = {
  name: string
  path: string
  size: number | string
  lastUpdate: string
}
export type DataDownloadV1Configuration = {
  readme?: string
  conceptDOI?: number
  doi?: string
  emailGroups?: string[]
  gcsFolder?: string
  files: DataDownloadDatasetFile[]
}

export type ThumbnailsV1Configuration = {
  scale?: number
}

export type DatasetConfigurationByType = Partial<{
  fourwingsV1: FourwingsV1Configuration
  bulkDownloadV1: BulkDownloadV1Configuration
  contextLayerV1: ContextLayerV1Configuration
  dataDownloadV1: DataDownloadV1Configuration
  eventsV1: EventsV1Configuration
  insightsV1: InsightsV1Configuration
  pmTilesV1: PmTilesV1Configuration
  temporalContextLayerV1: TemporalContextLayerV1Configuration
  thumbnailsV1: ThumbnailsV1Configuration
  tracksV1: TracksV1Configuration
  userContextLayerV1: UserContextLayerV1Configuration
  userTracksV1: UserTracksV1Configuration
  vesselsV1: VesselsV1Configuration
  frontend: FrontendConfiguration
}>

export type TimeFilterType = 'date' | 'dateRange'
export type DatasetConfigurationSourceFormat = 'GeoJSON' | 'Shapefile' | 'CSV' | 'KML'

export type DatasetGeometryType = 'polygons' | 'tracks' | 'points' | 'draw'
export type DatasetGeometryToGeoJSONGeometry = {
  [Property in DatasetGeometryType]: string[]
}
export type FrontendConfiguration = {
  disableInteraction?: boolean
  endTime?: string | number
  geometryType?: DatasetGeometryType
  latitude?: string
  lineId?: string | number
  longitude?: string
  max?: number
  maxPointSize?: number
  maxZoom?: number
  min?: number
  minPointSize?: number
  pointName?: string
  pointSize?: string
  polygonColor?: string
  segmentId?: string | number
  sourceFormat?: DatasetConfigurationSourceFormat
  startTime?: string | number
  timeFilterType?: TimeFilterType
  timestamp?: string
  translate?: boolean
  valueProperties?: string[]
}

export type SharedDatasetConfiguration = {
  apiSupportedVersions?: ApiSupportedVersions[]
  frontend: FrontendConfiguration
}

export const DATASET_TYPE_TO_CONFIG_TYPE = {
  [DatasetTypes.Context]: 'contextLayerV1' as const,
  [DatasetTypes.Download]: 'dataDownloadV1' as const,
  [DatasetTypes.Events]: 'eventsV1' as const,
  [DatasetTypes.Fourwings]: 'fourwingsV1' as const,
  [DatasetTypes.PMTiles]: 'pmTilesV1' as const,
  [DatasetTypes.TemporalContext]: 'temporalContextLayerV1' as const,
  [DatasetTypes.Thumbnails]: 'thumbnailsV1' as const,
  [DatasetTypes.Tracks]: 'tracksV1' as const,
  [DatasetTypes.UserContext]: 'userContextLayerV1' as const,
  [DatasetTypes.UserTracks]: 'userTracksV1' as const,
  [DatasetTypes.Vessels]: 'vesselsV1' as const,
}

export type DatasetTypeToConfigurationType = typeof DATASET_TYPE_TO_CONFIG_TYPE

type GetConfigurationType<T extends keyof DatasetTypeToConfigurationType> =
  DatasetTypeToConfigurationType[T]

export type DatasetConfiguration<
  T extends keyof DatasetTypeToConfigurationType = keyof DatasetTypeToConfigurationType,
> = SharedDatasetConfiguration &
  (keyof DatasetTypeToConfigurationType extends T
    ? DatasetConfigurationByType
    : {
        [K in GetConfigurationType<T>]-?: Required<DatasetConfigurationByType>[GetConfigurationType<T>]
      })
