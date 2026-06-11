import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers'
import type { StrictLoaderOptions } from '@loaders.gl/loader-utils'
import type { Feature, Point, Polygon } from 'geojson'

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
  cols: number[]
  rows: number[]
  tile?: TileLoadProps
  bufferedStartDate: number
  initialTimeRange?: {
    start: number
    end: number
  }
  interval: FourwingsInterval
  aggregationOperation: FourwingsAggregationOperation
  scale?: number[]
  offset?: number[]
  noDataValue?: number[]
  sublayers: number
  buffersLength: number[]
  workerUrl?: string
}

export type ParseFourwingsClustersOptions = Omit<
  ParseFourwingsOptions,
  'aggregationOperation' | 'sublayers' | 'initialTimeRange' | 'bufferedStartDate' | 'buffersLength'
> & {
  temporalAggregation?: boolean
}
export type FourwingsVectorsUnit = 'knots' | 'm/s' | 'km/h'
export type ParseFourwingsVectorsOptions = Omit<
  ParseFourwingsOptions,
  'aggregationOperation' | 'sublayers' | 'buffersLength'
> & { unit?: FourwingsVectorsUnit; temporalAggregation?: boolean }

export type FourwingsLoaderOptions = StrictLoaderOptions & {
  fourwings?: ParseFourwingsOptions
}

export type FourwingsClustersLoaderOptions = StrictLoaderOptions & {
  fourwingsClusters?: ParseFourwingsClustersOptions
}

export type FourwingsVectorsLoaderOptions = StrictLoaderOptions & {
  fourwingsVectors?: ParseFourwingsVectorsOptions
}

export type FourwingsFeatureValues = number[][]
export type FourwingsFeatureProperties = {
  id?: string
  initialValues: Record<string, number[]>
  startOffsets: number[]
  // Only set by the vectors parser. The heatmap parser doesn't store dates:
  // they are derived from tileStartFrame + startOffsets + value index to
  // halve the tile memory footprint
  dates?: FourwingsFeatureValues
  // Absolute interval frame of the tile's buffered start, base for deriving
  // the timestamp of each value: getIntervalTimestamp(tileStartFrame + startOffsets[i] + index)
  tileStartFrame?: number
  values: FourwingsFeatureValues
  cellId: number
  cellNum: number
  col: number
  row: number
  velocities?: number[]
  directions?: number[]
}

export type FourwingsPositionFeatureProperties = {
  id: string
  value: number
  stime: number
  [key: string]: any
}

export type FourwingsPointFeatureProperties = {
  id: number
  value: number
  cellNum: number
  cellBounds: number[]
  [key: string]: any
}

export type FourwingsMVTStaticFeatureProperties = {
  cell: number
  count: number
  values: number[][]
}

// Used to re-map the MVT property from cell to cellId and match the rest of the fourwings properties layers
export type FourwingsStaticFeatureProperties = Omit<FourwingsMVTStaticFeatureProperties, 'cell'> & {
  cellId: number
}

export type FourwingsFeature<Properties = FourwingsFeatureProperties> = {
  coordinates: number[]
  properties: Properties
} & {
  aggregatedValues?: number[]
}

// values in first place, absolute start frame in second: the timestamp of
// values[i] is getIntervalTimestamp(startFrame + i)
export type FourwingsValuesAndStartFrameFeature = [number[], number][]
export type FourwingsMVTStaticFeature = FourwingsFeature<FourwingsMVTStaticFeatureProperties> & {
  geometry: Polygon
}
export type FourwingsStaticFeature = FourwingsFeature<FourwingsStaticFeatureProperties> & {
  geometry: Polygon
}
export type FourwingsPositionFeature = Feature<Point, FourwingsPositionFeatureProperties>
export type FourwingsPointFeature = Feature<Point, FourwingsPointFeatureProperties>
