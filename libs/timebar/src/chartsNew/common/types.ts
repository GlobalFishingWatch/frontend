import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'

export type TrackEventChunkProps = {
  type: EventTypes
  color: string
  colorLabels?: string
  description: string
  descriptionGeneric: string
}

export type TimebarChartValue = {
  timestamp: number
  value?: number
}

export type TimebarChartChunk<T = void> = {
  start: number
  end?: number
  id?: string | number
  values?: TimebarChartValue[]
  x?: number
  width?: number
  props?: T
}

export type TimebarChartItem<T = void> = {
  chunks: TimebarChartChunk<T>[]
  color?: string
  status?: ResourceStatus
  y?: number
  getHighlighterLabel?:
    | string
    | ((chunk: TimebarChartChunk, value: TimebarChartValue | undefined) => string)
}

export type TimebarChartData<T = void> = TimebarChartItem<T>[]
