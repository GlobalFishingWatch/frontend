import { ResourceStatus } from '@globalfishingwatch/api-types'

export type EventType = 'fishing' | 'encounter'

export type AnyChartDataItemType = EventType

export type TimebarChartDataChunkValue = {
  timestamp: number
  value?: number
}

export type TimebarChartDataChunk = {
  start: number
  end?: number
  id?: string | number
  type?: AnyChartDataItemType | string
  color?: string
  values?: TimebarChartDataChunkValue[]
}

export type TimebarChartDataItem = {
  chunks: TimebarChartDataChunk[]
  color?: string
  status?: ResourceStatus
  getHighlighterLabel?:
    | string
    | ((chunk: TimebarChartDataChunk, value: TimebarChartDataChunkValue | undefined) => string)
}

export type TimebarChartData = TimebarChartDataItem[]
