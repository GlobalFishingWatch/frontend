export type GeomGl = 'heatmap' | 'fill' | 'fill-extrusion' | 'symbol'
export type HeatmapGeomGL = {
  [key: string]: GeomGl
}

export type stats = {
  max: number
  min: number
  median: number
  avg: number
  zoom: number
  area: number
}

export type statsByZoom = {
  [key: number]: stats
}

export enum HeatmapAnimatedCombinationMode {
  // Add all sublayer raw values
  Add = 'add',
  // Returns a bucket index depending on sublayer with highest value + position on sublayer color ramp
  Compare = 'compare',
  // Returns a bucket index depending on a 2D color ramp
  Bivariate = 'bivariate',
  // Returns raw values that can be decoded with JSON.parse (number or array of numbers). Used for interaction layer
  Literal = 'literal',
  // Returns raw values as a string in the format AAAABBBBCCCC (where A, B, C, 3 sublayers), and where BBBB is
  // sublayer 0 + sublayer 1 and CCCC is sublayer 0 + sublayer 1 + sublayer 2. Used for extruded layer.
  Cumulative = 'cumulative',
}
