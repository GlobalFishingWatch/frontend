import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'

import { HeatmapAnimatedMode } from '../types'

import type { Interval } from './types'

export const TEMPORALGRID_SOURCE_LAYER = 'temporalgrid'
export const TEMPORALGRID_SOURCE_LAYER_INTERACTIVE = 'temporalgrid_interactive'
export const TEMPORALGRID_LAYER_INTERACTIVE_SUFIX = 'interaction'

export const API_ENDPOINTS = {
  tiles: '4wings/tile/heatmap/{z}/{x}/{y}',
  breaks: '4wings/bins/{zoom}',
  statistics: '4wings/statistics',
}

export const HEATMAP_DEFAULT_MAX_ZOOM = 12

// This also defines the priority order, so remember to keep it ascendent
export const DEFAULT_HEATMAP_INTERVALS: Interval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']
export const DEFAULT_ENVIRONMENT_INTERVALS: Interval[] = ['DAY', 'MONTH']

export const HEATMAP_MODE_COMBINATION: Record<HeatmapAnimatedMode, SublayerCombinationMode> = {
  [HeatmapAnimatedMode.Single]: SublayerCombinationMode.None,
  [HeatmapAnimatedMode.Compare]: SublayerCombinationMode.Max,
  [HeatmapAnimatedMode.Bivariate]: SublayerCombinationMode.Bivariate,
  [HeatmapAnimatedMode.TimeCompare]: SublayerCombinationMode.TimeCompare,
  [HeatmapAnimatedMode.Blob]: SublayerCombinationMode.Literal,
  [HeatmapAnimatedMode.Extruded]: SublayerCombinationMode.Cumulative,
}

export const HEATMAP_MODE_LAYER_TYPE: Record<HeatmapAnimatedMode, string> = {
  [HeatmapAnimatedMode.Single]: 'fill',
  [HeatmapAnimatedMode.Compare]: 'fill',
  [HeatmapAnimatedMode.Bivariate]: 'fill',
  [HeatmapAnimatedMode.TimeCompare]: 'fill',
  [HeatmapAnimatedMode.Blob]: 'heatmap',
  [HeatmapAnimatedMode.Extruded]: 'fill-extrusion',
}

export const GRID_AREA_BY_ZOOM_LEVEL = [
  128000000000, 32000000000, 8000000000, 2000000000, 500000000, 120000000, 31000000, 8000000,
  2000000, 500000, 125000, 30000, 7500,
]

export const COLOR_RAMP_DEFAULT_NUM_STEPS = 10
export const COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE = [7, 3]
