import type { TimeRange } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer, UserPointsTileLayer } from '@globalfishingwatch/deck-layers'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps, ReportGraphStats } from 'features/reports/reports-timeseries.hooks'
import {
  getFourwingsTimeseries,
  getFourwingsTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'

export type GetTimeseriesParams = {
  featuresFiltered: FilteredPolygons[][]
  instances: (FourwingsLayer | UserPointsTileLayer)[]
}
export const getTimeseries = ({ featuresFiltered, instances }: GetTimeseriesParams) => {
  const timeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    if (instance.props.category === 'user' || instance.props.category === 'context') {
      console.log('TODO')
      // timeseries.push(timeseries)
    } else {
      const features = featuresFiltered?.[index]
      const fourwingsTimeseries = getFourwingsTimeseries({
        instance: instance as FourwingsLayer,
        features,
      })
      if (fourwingsTimeseries) {
        timeseries.push(fourwingsTimeseries)
      }
    }
  })
  return timeseries
}

export type GetTimeseriesParamsStats = GetTimeseriesParams & TimeRange
export const getTimeseriesStats = ({
  featuresFiltered,
  instances,
  start,
  end,
}: GetTimeseriesParamsStats) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    if (instance.props.category === 'user' || instance.props.category === 'context') {
      console.log('TODO')
    } else {
      const features = featuresFiltered?.[index]
      const stats = getFourwingsTimeseriesStats({
        instance: instance as FourwingsLayer,
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
