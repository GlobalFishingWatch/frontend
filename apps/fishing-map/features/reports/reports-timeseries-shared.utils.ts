import type { Feature, Point } from 'geojson'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

import type { DateTimeSeries } from 'features/reports/report-area/area-reports.hooks'
import type {
  FourwingsReportGraphStats,
  PointsReportGraphStats,
} from 'features/reports/reports-timeseries.hooks'

export interface TimeSeriesFrame {
  frame: number
  // key will be "0", "1", etc corresponding to a stringified sublayer index.
  // This is intended to accomodate the d3 layouts we use. The associated value corresponds to
  // the sum or avg (depending on aggregationOp used) for all cells at this frame for this sublayer
  [key: string]: number
}

export type TimeSeries = {
  values: TimeSeriesFrame[]
  minFrame: number
  maxFrame: number
}

export const frameTimeseriesToDateTimeseries = (
  frameTimeseries: TimeSeriesFrame[]
): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, count, date, ...rest } = frameValues
    const dateTime = getUTCDate(date)
    return {
      values: Object.values(rest) as number[],
      date: dateTime.toISOString(),
    }
  })
  return dateFrameseries
}

export function getStatsValue<
  T extends keyof FourwingsReportGraphStats | keyof PointsReportGraphStats,
>(
  stats: FourwingsReportGraphStats | PointsReportGraphStats,
  property: T
): T extends keyof PointsReportGraphStats
  ? PointsReportGraphStats[T]
  : T extends keyof FourwingsReportGraphStats
    ? FourwingsReportGraphStats[T]
    : never {
  if (stats.type === 'points') {
    return stats[property as keyof PointsReportGraphStats] as any
  } else {
    return stats[property as keyof FourwingsReportGraphStats] as any
  }
}
