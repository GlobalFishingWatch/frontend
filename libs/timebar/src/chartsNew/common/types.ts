import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'

export type TrackEventChunkProps = {
  color: string
  colorLabels?: string
  description: string
  descriptionGeneric: string
  latitude: number
  longitude: number
}

export type TimebarChartValue = {
  timestamp: number
  value?: number
}

export type TimebarChartChunkCluster = {
  numChunks: number
}

export type TimebarChartChunk<T = void> = {
  start: number
  end?: number
  id?: string | number
  type?: EventTypes
  values?: TimebarChartValue[]
  x?: number
  width?: number
  height?: number
  cluster?: TimebarChartChunkCluster
  props?: T
}

export type TimebarChartItem<T = void> = {
  chunks: TimebarChartChunk<T>[]
  color?: string
  status?: ResourceStatus
  y?: number
  getHighlighterLabel?:
    | string
    | ((chunk: TimebarChartChunk<any>, value: TimebarChartValue | undefined) => string)
}

export type TimebarChartData<T = void> = TimebarChartItem<T>[]

export type ChartType = 'tracks' | 'tracksEvents' | 'tracksGraphs' | 'activity'

export type TimebarChartsData = Record<ChartType, TimebarChartData<void>>
