import { Interval } from '../types'
import { HeatmapAnimatedMode, HeatmapAnimatedGeneratorConfig } from '../../types'
import { getInterval } from './time-chunks'

export const getTimeChunksInterval = (
  config: HeatmapAnimatedGeneratorConfig,
  start: string,
  end: string
) => {
  const availableIntervals = config.availableIntervals
    ? [config.availableIntervals]
    : (config.sublayers || []).map((s) => s.availableIntervals)
  const omitIntervals: Interval[] =
    config.mode === HeatmapAnimatedMode.TimeCompare ? ['month', '10days'] : []
  const interval = getInterval(start, end, availableIntervals as Interval[][], omitIntervals)
  return interval
}
