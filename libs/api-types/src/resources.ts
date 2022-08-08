import type { Segment } from '@globalfishingwatch/data-transforms'
import { Dataset } from './datasets'
import { DataviewDatasetConfig } from '.'

export type ResourceResponseType = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'

export type ResourceRequestType = 'json' | 'formData'

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
