import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'

export type TrackEventChunkProps = {
  type: EventTypes
  color: string
  colorLabels?: string
  description: string
  descriptionGeneric: string
}

export type TimebarChartDataChunkValue = {
  timestamp: number
  value?: number
}

export type TimebarChartDataChunk<T = void> = {
  start: number
  end?: number
  id?: string | number
  values?: TimebarChartDataChunkValue[]
  props?: T
}

export type TimebarChartDataItem<T = void> = {
  chunks: TimebarChartDataChunk<T>[]
  color?: string
  status?: ResourceStatus
  getHighlighterLabel?:
    | string
    | ((chunk: TimebarChartDataChunk, value: TimebarChartDataChunkValue | undefined) => string)
}

export type TimebarChartData<T = void> = TimebarChartDataItem<T>[]
