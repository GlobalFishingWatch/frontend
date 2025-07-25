import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { TimeRange } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'

import type { DateTimeSeries } from 'features/reports/report-area/area-reports.hooks'
import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps, ReportGraphStats } from 'features/reports/reports-timeseries.hooks'
import {
  getFourwingsTimeseries,
  getFourwingsTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { getPointsTimeseries } from 'features/reports/tabs/others/reports-points-timeseries.utils'

export type GetTimeseriesParams<T extends FourwingsLayer | UserPointsTileLayer> = {
  featuresFiltered: FilteredPolygons[][]
  instances: T[]
}

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

export const isInstanceOfPointsLayer = (instance: FourwingsLayer | UserPointsTileLayer) => {
  return instance instanceof UserPointsTileLayer
}

export const getTimeseries = <T extends FourwingsLayer | UserPointsTileLayer>({
  featuresFiltered,
  instances,
}: GetTimeseriesParams<T>) => {
  const timeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPointsLayer(instance)) {
      const fourwingsTimeseries = getPointsTimeseries({
        instance,
        features,
      })
      if (fourwingsTimeseries) {
        timeseries.push(fourwingsTimeseries)
      }
    } else {
      const fourwingsTimeseries = getFourwingsTimeseries({
        instance: instance,
        features,
      })
      if (fourwingsTimeseries) {
        timeseries.push(fourwingsTimeseries)
      }
    }
  })
  return timeseries
}

export const getTimeseriesStats = <T extends FourwingsLayer | UserPointsTileLayer>({
  featuresFiltered,
  instances,
  start,
  end,
}: GetTimeseriesParams<T> & TimeRange) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    if (!isInstanceOfPointsLayer(instance)) {
      const features = featuresFiltered?.[index]
      const stats = getFourwingsTimeseriesStats({
        instance: instance,
        features,
        start,
        end,
      })
      if (stats) {
        timeseriesStats[instance.id] = stats
      }
    }
  })
  return timeseriesStats
}

export const filterTimeseriesByTimerange = (
  timeseries: ReportGraphProps[],
  start: string,
  end: string
) => {
  return timeseries?.map((layerTimeseries) => {
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current) => {
        return (
          (current.max.some((v) => v !== 0) || current.min.some((v) => v !== 0)) &&
          current.date >= start &&
          current.date < end
        )
      }),
    }
  })
}
