import { ResourceStatus } from '@globalfishingwatch/api-types'

export type EventType = 'fishing' | 'encounter'

export type AnyChartDataItemType = EventType

export type TimebarChartDataChunk = {
  start: number
  end?: number
  id?: string | number
  type?: AnyChartDataItemType | string
  color?: string
  props?: Record<string, any>
}

export type TimebarChartDataItem = {
  chunks: TimebarChartDataChunk[]
  color?: string
  status?: ResourceStatus
}

export type TimebarChartData = TimebarChartDataItem[]
