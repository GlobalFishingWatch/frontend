import { Dataset } from './datasets'
import { DataviewDatasetConfig } from '.'

export type ResourceResponseType = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'

export type ResourceRequestType = 'json' | 'formData'

export enum Field {
  lonlat = 'lonlat',
  longitude = 'longitude',
  latitude = 'latitude',
  timestamp = 'timestamp',
  fishing = 'fishing',
  speed = 'speed',
  course = 'course',
  night = 'night',
  distanceFromPort = 'distance_from_port',
  elevation = 'elevation',
  id = 'id',
  color = 'color',
}

export type Point = Partial<Record<Field, number | null>>

export type Segment = Point[]

export type TrackResourceData = Segment[]

export enum ResourceStatus {
  Idle = 'idle',
  Aborted = 'aborted',
  Loading = 'loading',
  Finished = 'finished',
  Error = 'error',
}

export interface Resource<T = any> {
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
