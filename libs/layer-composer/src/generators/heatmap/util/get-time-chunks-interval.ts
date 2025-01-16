import type { HeatmapAnimatedGeneratorConfig } from '../../types';
import { HeatmapAnimatedMode } from '../../types'
import type { Interval } from '../types'

import { getInterval } from './time-chunks'

export const TIME_COMPARISON_NOT_SUPPORTED_INTERVALS: Interval[] = ['MONTH', 'YEAR']

export const getTimeChunksInterval = (
  config: HeatmapAnimatedGeneratorConfig,
  start: string,
  end: string
) => {
  const availableIntervals = config.availableIntervals
    ? [config.availableIntervals]
    : (config.sublayers || []).map((s) => s.availableIntervals)
  const omitIntervals: Interval[] =
    config.mode === HeatmapAnimatedMode.TimeCompare ? TIME_COMPARISON_NOT_SUPPORTED_INTERVALS : []

  const interval = getInterval(start, end, availableIntervals as Interval[][], omitIntervals)
  return interval
}
