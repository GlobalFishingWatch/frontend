import type { LoaderOptions } from '@loaders.gl/loader-utils'
import { TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
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

export type Interval = 'YEAR' | 'MONTH' | 'DAY' | 'HOUR'

export type FourwingsOptions = {
  cols: number
  rows: number
  tile: TileLoadProps
  minFrame: number
  maxFrame: number
  initialTimeRange: {
    start: number
    end: number
  }
  interval: Interval
  sublayers: number
  buffersLength: number[]
}

export type FourwingsLoaderOptions = LoaderOptions & {
  fourwings?: FourwingsOptions
}

export type FourWingsFeatureProperties = {
  initialValues: Record<string, number[]>
  startFrames: number[]
  dates: number[][]
  values: number[][]
  cellId: number
}

export type FourWingsFeature = Feature<Polygon, FourWingsFeatureProperties>
