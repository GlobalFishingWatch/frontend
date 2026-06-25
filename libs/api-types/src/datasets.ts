import type { DatasetConfiguration, DatasetTypeToConfigurationType } from './datasets.configuration'
import { DatasetTypes } from './datasets.configuration'
import type { DatasetFilters } from './datasets.filters'
import type { EventTypes } from './events'

export { DatasetTypes }

export const DRAW_DATASET_SOURCE = 'drawn_on_gfw_map'

export type UploadResponse = {
  path: string
  url: string
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
  Animal = 'animal',
  Chlorophyl = 'chlorophyl',
  Currents = 'currents',
  Fishing = 'fishing',
  Info = 'info',
  Insight = 'insight',
  Loitering = 'loitering',
  Nitrate = 'nitrate',
  Oxygen = 'oxygen',
  Ph = 'ph',
  Phosphate = 'phosphate',
  Port_visit = 'port_visit',
  Presence = 'presence',
  RealTime = 'real-time',
  Salinity = 'salinity',
  Sar = 'sar',
  Sentinel2 = 'sentinel-2',
  Track = 'track',
  User = 'user',
  UserInteractive = 'user-interactive',
  Viirs = 'viirs',
  Water = 'water-temperature',
  Waves = 'waves',
  Winds = 'winds',
}

export type DatasetSubCategories = `${DatasetSubCategory}`

export type DatasetFile = {
  name: string
  path: string
  size: number | string
  lastUpdate: string
}

export type DatasetI18nFilter = {
  label?: string
  enum?: Record<string, string>
}
export type DatasetI18nFilters = Record<string, DatasetI18nFilter>

export type DatasetI18n = {
  name?: string
  description?: string
  filters: DatasetI18nFilters
}

export type Dataset<T extends DatasetTypes = DatasetTypes> = {
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
  i18n?: DatasetI18n
  ownerType: string
  ownerId: number
  startDate?: string
  endDate?: string
  lastUpdated?: string
  createdAt: string
  relatedDatasets: RelatedDataset[] | null
  filters: DatasetFilters
}

export type DownloadDataset = {
  id: string
  name: string
  description: string
  doi: string
  concept_doi: number
  lastUpdated: string
  readme: string
  files: DatasetFile[]
}
