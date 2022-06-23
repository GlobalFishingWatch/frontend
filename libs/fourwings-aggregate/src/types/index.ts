export type BBox = [number, number, number, number]

export enum GeomType {
  point = 'point',
  rectangle = 'rectangle',
}

export enum SublayerCombinationMode {
  None = 'none',
  // Add all sublayer raw values
  Add = 'add',
  // Returns a bucket index depending on sublayer with highest value + position on sublayer color ramp
  Max = 'max',
  // Returns a bucket index depending on delta value between two sublayers
  TimeCompare = 'timecompare',
  // Returns a bucket index depending on a 2D color ramp
  Bivariate = 'bivariate',
  // Returns raw values that can be decoded with JSON.parse (number or array of numbers). Used for interaction layer
  Literal = 'literal',
  // Returns raw values as a string in the format AAAABBBBCCCC (where A, B, C, 3 sublayers), and where BBBB is
  // sublayer 0 + sublayer 1 and CCCC is sublayer 0 + sublayer 1 + sublayer 2. Used for extruded layer.
  Cumulative = 'cumulative',
}

export enum AggregationOperation {
  Sum = 'sum',
  Avg = 'avg',
}

export type BaseTileAggregationParams = {
  // At which frame should we start counting (related to when the time chunk starts
  quantizeOffset: number
  // Number of rames to aggregate, ie number of frames between active time start & end
  delta: number
  // Which type of geometry to generate
  geomType: GeomType
  // When set to true, aggregation will be done on the backend
  singleFrame: boolean
  // When set to true, generate a second sourceLayer that contains the raw data
  interactive: boolean
  // Sets value breaks for each sublayer. When set, values will return a bucket index instead of the actual value
  sublayerBreaks?: number[][]
  // Sets the number of sublayers
  sublayerCount: number
  // Defines how sublayers computed values are combined in cell properties
  sublayerCombinationMode: SublayerCombinationMode
  // Defines sublayers visibilty, ie aallow toggling sublayers without reloading source
  sublayerVisibility: boolean[]
  // aggergationOperation
  aggregationOperation?: AggregationOperation
}

export interface TileAggregationParams extends BaseTileAggregationParams {
  // Tile Bbox, used to generate geometries at the correct location
  tileBBox: BBox
  // Tile coordinates
  x: number
  y: number
  z: number
}

export type TileAggregationDateRange = [string, string]
export type TileAggregationComparisonDateRange = [string, string, string, string]

export interface TileAggregationSourceParams extends BaseTileAggregationParams {
  id: string
  interval: string
  filters: string[]
  datasets: string[]
  proxy?: boolean
  'date-range'?: TileAggregationDateRange
  'vessel-groups'?: string[]
  'comparison-range'?: TileAggregationComparisonDateRange
}

export type TileAggregationSourceParamsSerialized = Partial<{
  [key in keyof TileAggregationSourceParams]: string
}>

export type CellAggregationParams = {
  rawValues: string
  frame: number
  delta: number
  quantizeOffset: number
  sublayerCount: number
  aggregationOperation?: AggregationOperation
  sublayerCombinationMode?: SublayerCombinationMode
  multiplier?: number
}

export type FeatureParams = {
  geomType: GeomType
  tileBBox: BBox
  cell: number
  numCols: number
  numRows: number
  id: number
  addMeta?: boolean
}
