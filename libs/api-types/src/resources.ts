import { Dataset } from './datasets'
import { DataviewDatasetConfig } from './dataviews'

export type ResourceResponseType = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'

export type ResourceRequestType = 'json' | 'formData'

export enum Field {
  lonlat = 'lonlat',
  longitude = 'longitude',
  latitude = 'latitude',
  timestamp = 'timestamp',
  fishing = 'fishing',
  speed = 'speed',
  depth = 'depth',
  course = 'course',
  night = 'night',
  distanceFromPort = 'distance_from_port',
  elevation = 'elevation',
  id = 'id',
  color = 'color',
}

export type PointProperties = Record<string, any>
export type Point = Partial<Record<Field, number | null>> & { properties?: PointProperties }

export type Segment = Point[]

export type TrackResourceData = Segment[]

export enum ResourceStatus {
  Idle = 'idle',
  Aborted = 'aborted',
  Loading = 'loading',
  Finished = 'finished',
  Error = 'error',
}

export interface Resource<T = unknown> {
  key?: string // used to store the resource in the same reducer key
  dataviewId: number | string
  dataset: Dataset
  datasetConfig: DataviewDatasetConfig
  url: string // identifies resource uniquely
  responseType?: ResourceResponseType
  requestType?: ResourceRequestType
  status?: ResourceStatus
  data?: T
}
