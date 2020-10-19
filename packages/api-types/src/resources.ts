export type ResourceResponseType = 'default' | 'text' | 'json' | 'blob' | 'arrayBuffer' | 'vessel'

export interface Resource<T = unknown> {
  dataviewId: number | string
  datasetId: string
  type?: string
  // identifies resource uniquely, ie vessel id
  datasetParamId: string
  resolvedUrl: string
  responseType?: ResourceResponseType
  data?: T
}
