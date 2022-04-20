import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'

export type TrackChunkProps = {
  id?: string
  color?: string
}

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
  frame?: number
}

export type TimebarChartChunkCluster = {
  ids: string[]
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

export type HighlighterCallbackFn = (
  chunk: TimebarChartChunk<any>,
  value: TimebarChartValue | undefined,
  item?: TimebarChartItem,
  itemIndex?: number
) => string
export type HighlighterCallback = string | HighlighterCallbackFn

export type HighlighterDateCallback = (timestamp: number) => string

export type TimebarChartItem<T = void> = {
  chunks: TimebarChartChunk<T>[]
  color?: string
  status?: ResourceStatus
  y?: number
  defaultLabel?: string
  getHighlighterLabel?: HighlighterCallback
  props?: any
}

export type TimebarChartData<T = void> = TimebarChartItem<T>[]

export type ChartType = 'tracks' | 'tracksEvents' | 'tracksGraphs' | 'activity'

export type TimebarChartsData = Record<ChartType, { data: TimebarChartData<void>; active: boolean }>

export type HighlightedChunks = Partial<Record<ChartType, string[]>>

export type Timeseries = { frame: number; date: number; [key: number]: number }[]
