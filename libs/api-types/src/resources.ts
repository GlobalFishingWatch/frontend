import type { Dataset } from './datasets'
import type { DataviewDatasetConfig } from './dataviews'

export type ResourceResponseType = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'

export type ResourceRequestType = 'json' | 'formData'

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
