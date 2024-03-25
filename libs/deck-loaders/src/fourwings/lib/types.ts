import type { LoaderOptions } from '@loaders.gl/loader-utils'
import { TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { Feature, Polygon } from 'geojson'

export type FourwingsRawData = number[]

export type FourwingsTileData = {
  cols: number
  rows: number
  cells: Cell[]
}

export type Cell = number[][]

export type TileCell = Cell & {
  coordinates: [number[]]
}

export type FourwingsInterval = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR'
type FourwingsAggregationOperation = 'sum' | 'avg'

export type ParseFourwingsOptions = {
  cols: number
  rows: number
  tile: TileLoadProps
  minFrame: number
  maxFrame: number
  initialTimeRange: {
    start: number
    end: number
  }
  interval: FourwingsInterval
  aggregationOperation: FourwingsAggregationOperation
  scale?: number
  offset?: number
  noDataValue?: number
  sublayers: number
  buffersLength: number[]
}

export type FourwingsLoaderOptions = LoaderOptions & {
  fourwings?: ParseFourwingsOptions
}

export type FourWingsFeatureProperties = {
  initialValues: Record<string, number[]>
  startFrames: number[]
  dates: number[][]
  values: number[][]
  cellId: number
  cellNum: number
}
export type FourWingsStaticFeatureProperties = {
  count: number
}

export type FourWingsFeature<Properties = FourWingsFeatureProperties> = Feature<Polygon, Properties>
export type FourWingsStaticFeature = FourWingsFeature<FourWingsStaticFeatureProperties>
