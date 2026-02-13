import type { DatasetConfiguration, DatasetTypeToConfigurationType } from './datasets.configuration'
import type { DatasetFilters } from './datasets.filters'
import type { Endpoint } from './endpoints'
import type { EventTypes } from './events'

export const DRAW_DATASET_SOURCE = 'drawn_on_gfw_map'

export type UploadResponse = {
  path: string
  url: string
}

export enum DatasetTypes {
  BulkDownload = 'bulk-download:v1',
  Context = 'context-layer:v1',
  Download = 'data-download:v1',
  Events = 'events:v1',
  Fourwings = '4wings:v1',
  Insights = 'insights:v1',
  PMTiles = 'pm-tiles:v1',
  TemporalContext = 'temporal-context-layer:v1',
  Thumbnails = 'thumbnails:v1',
  Tracks = 'tracks:v1',
  UserContext = 'user-context-layer:v1',
  UserTracks = 'user-tracks:v1',
  Vessels = 'vessels:v1',
}

export type DatasetType = `${DatasetTypes}`

export enum DatasetStatus {
  Deleted = 'deleted',
  Done = 'done',
  Error = 'error',
  Importing = 'importing',
}

export type DatasetDocumentationTypes =
  | 'fishing-effort'
  | 'presence'
  | 'vessels'
  | 'tracks'
  | 'events'
  | 'environmental'
  | 'insights'

export enum DatasetDocumentationStatusTypes {
  Active = 'Active',
  Deprecated = 'Deprecated',
}

export type DatasetDocumentation = {
  type?: DatasetDocumentationTypes
  enable?: boolean
  status?: DatasetDocumentationStatusTypes
  queries?: string[]
  provider?: string
}

export type DatasetConfigurationInterval = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR'

export type RelatedDataset = {
  id: string
  type: DatasetTypes
}

export enum DatasetCategory {
  Activity = 'activity',
  Context = 'context',
  Detections = 'detections',
  Environment = 'environment',
  Event = 'event',
  Vessel = 'vessel',
  VesselGroups = 'vessel groups',
}

export type DatasetCategories = `${DatasetCategory}`

export enum DatasetSubCategory {
  Fishing = 'fishing',
  Info = 'info',
  Presence = 'presence',
  Sar = 'sar',
  Sentinel2 = 'sentinel-2',
  Track = 'track',
  Viirs = 'viirs',
  User = 'user',
  UserInteractive = 'user-interactive',
  Animal = 'animal',
  Chlorophyl = 'chlorophyl',
  Currents = 'currents',
  Insight = 'insight',
  Loitering = 'loitering',
  Nitrate = 'nitrate',
  Oxygen = 'oxygen',
  Ph = 'ph',
  Phosphate = 'phosphate',
  Port_visit = 'port_visit',
  Salinity = 'salinity',
  Winds = 'winds',
  Water = 'water-temperature',
  Waves = 'waves',
}

export type DatasetSubCategories = `${DatasetSubCategory}`

export type DatasetFile = {
  name: string
  path: string
  size: number | string
  lastUpdate: string
}

export type ApiDataset<T extends DatasetTypes = DatasetTypes> = {
  id: string
  type: T
  alias: string[] | null
  name: string
  description: string
  category: DatasetCategory
  configuration: [DatasetTypes] extends [T]
    ? DatasetConfiguration
    : T extends keyof DatasetTypeToConfigurationType
      ? DatasetConfiguration<T>
      : null
  documentation: DatasetDocumentation
  subcategory?: DatasetSubCategory | EventTypes
  source?: string
  status: DatasetStatus
  unit?: string
  ownerType: string
  ownerId: number
  startDate?: string
  endDate?: string
  lastUpdated?: string
  createdAt: string
  relatedDatasets: RelatedDataset[] | null
  filters: DatasetFilters
}

export type Dataset<T extends DatasetTypes = DatasetTypes> = ApiDataset<T> & {
  endpoints: Endpoint[]
}

export type DownloadDataset<T extends DatasetTypes = DatasetTypes> = ApiDataset<T> & {
  readme?: string
  files?: DatasetFile[]
}
