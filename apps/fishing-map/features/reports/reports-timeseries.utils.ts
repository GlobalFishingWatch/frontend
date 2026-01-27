import type { TimeRange } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer, FourwingsVectorsTileLayer } from '@globalfishingwatch/deck-layers'
import { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps, ReportGraphStats } from 'features/reports/reports-timeseries.hooks'
import {
  getFourwingsTimeseries,
  getFourwingsTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import {
  getPointsTimeseries,
  getPointsTimeseriesStats,
} from 'features/reports/tabs/others/reports-points-timeseries.utils'

export type ReportFourwingsDeckLayer = FourwingsLayer | FourwingsVectorsTileLayer
export type ReportPointsDeckLayer = UserPointsTileLayer
export type ReportDeckLayer = ReportFourwingsDeckLayer | ReportPointsDeckLayer

export type GetTimeseriesParams<T extends ReportDeckLayer> = {
  featuresFiltered: FilteredPolygons[][]
  instances: T[]
}

export const isInstanceOfPointsLayer = (instance: ReportDeckLayer) => {
  return instance instanceof UserPointsTileLayer
}

export const getTimeseries = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
}: GetTimeseriesParams<T>) => {
  const timeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPointsLayer(instance)) {
      const pointsTimeseries = getPointsTimeseries({
        instance,
        features,
      })
      if (pointsTimeseries) {
        timeseries.push(pointsTimeseries)
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

export const getTimeseriesStats = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
  start,
  end,
}: GetTimeseriesParams<T> & TimeRange) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPointsLayer(instance)) {
      const stats = getPointsTimeseriesStats({
        instance,
        features,
      })
      if (stats) {
        timeseriesStats[instance.id] = stats
      }
    } else {
      const stats = getFourwingsTimeseriesStats({
        instance,
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
