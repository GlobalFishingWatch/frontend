import { FeatureCollection } from '@turf/helpers'

export type ValueOf<T> = T[keyof T]

export type CurrentTab = 'carriers' | 'flags' | 'ports'
export type EventType = 'encounter' | 'loitering'
export type GraphType =
  | 'eez'
  | 'rfmo'
  | 'port'
  | 'flag-carrier'
  | 'flag-vessel'
  | 'time'
  | 'loitering-eez'
  | 'loitering-rfmo'
  | 'loitering-port'
  | 'loitering-flag'
  | 'loitering-time'

export type ContextualLayerTypes =
  | 'cp_rfmo'
  | 'cp_next_port'
  | 'other_rfmos'
  | 'eez'
  | 'mpant'
  | 'bluefin_rfmo'
export type HeatmapLayerType = 'heatmap'
export type LayerTypes = ContextualLayerTypes | EventType | HeatmapLayerType

export type SearchTypes =
  | 'flag'
  | 'flagDonor'
  | 'eez'
  | 'rfmo'
  | 'vessel'
  | 'start'
  | 'end'
  | 'port'
  | 'duration'

export type QueryParam =
  | SearchTypes
  | 'eventType'
  | 'tab'
  | 'graph'
  | 'timestamp'
  | 'layer'
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'dataset'
  | 'access-token'

export type QueryParams = {
  [key in QueryParam]?: string | number | array | null
}

export type SearchItem = {
  id: string
  key?: string
  label: string
  legend?: string
}

export type EventsDateRange = {
  start: number
  end: number
}

export type EventsDurationRange = number[]

export type EventsFilter = {
  eezs: string[]
  rfmos: string[]
  ports: string[]
  flags: string[]
  donorFlags: string[]
  dateRange: EventsDateRange
  durationRange: EventsDurationRange
}

export interface SearchItemType extends SearchItem {
  type: string
  counter?: number
  iso?: string
}

export type CoordinatePosition = {
  latitude: number
  longitude: number
}

export type CoordinateProperties = {
  id: string
  type: string
  coordinateProperties: {
    times: number[]
  }
}

export type TrackGeometry = FeatureCollection<Geometry, CoordinateProperties>

export type TrackInterface = {
  id: string
  data: TrackGeometry
}

export type ContextLayer = {
  id: ContextLayerTypes
  label: string
  color: string
  active?: boolean
  description?: string
  disabled?: bool
}

export type GraphOption = {
  label: string
  value: GraphType
  tooltip?: string
  noDataMsg?: string
  disabled?: boolean
}

export type InfoField = {
  label: string
  value: VesselHistoricalChange[] | string
  key: string
}

export type MapModuleBounds = {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export type DatasetDates = {
  start: string
  end: string
}

export type EncounterTypes = {
  id: string
  label: string
  color: string
  tooltip?: string
}
