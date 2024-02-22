import type { LoaderOptions } from '@loaders.gl/loader-utils'

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
  minFrame: number
  maxFrame: number
  interval: Interval
  sublayers: number
  buffersLength: number[]
}

export type FourwingsLoaderOptions = LoaderOptions & {
  fourwings?: FourwingsOptions
}
