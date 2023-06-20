import {
  EncounterEvent,
  EventTypes,
  PortEvent,
  ResourceStatus,
  Vessel,
} from '@globalfishingwatch/api-types'

export type TrackChunkProps = {
  id?: string
  color?: string
  height?: number
}

export type TrackEventChunkProps = {
  color: string
  colorLabels?: string
  description: string
  descriptionGeneric: string
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
  coordinates?: [number, number]
  x?: number
  width?: number
  height?: number
  cluster?: TimebarChartChunkCluster
  encounter?: EncounterEvent<Vessel>
  port?: PortEvent
  props?: T
}

export type HighlighterCallbackFnArgs = {
  chunk: TimebarChartChunk<any>
  value: TimebarChartValue | undefined
  item?: TimebarChartItem
  itemIndex?: number
  expanded?: boolean
}

export type HighlighterCallbackFn = (args: HighlighterCallbackFnArgs) => string
export type HighlighterCallback = string | HighlighterCallbackFn

export type HighlighterDateCallback = (timestamp: number) => string

export type TimebarChartItem<T = void> = {
  chunks: TimebarChartChunk<T>[]
  color?: string
  status?: ResourceStatus
  y?: number
  defaultLabel?: string
  getHighlighterLabel?: HighlighterCallback
  getHighlighterIcon?: HighlighterCallback
  props?: any
}

export type TimebarChartData<T = void> = TimebarChartItem<T>[]

export type ChartType = 'tracks' | 'tracksEvents' | 'tracksGraphs' | 'activity'

export type TimebarChartsData = Record<ChartType, { data: TimebarChartData<void>; active: boolean }>

export type HighlightedChunks = Partial<Record<ChartType, string[]>>

export type Timeseries = { frame?: number; date: number; [key: number]: number }[]

export type ActivityTimeseriesFrame = { date: number; [key: string]: number }
