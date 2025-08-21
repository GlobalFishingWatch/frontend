import type { Feature, Point } from 'geojson'

import {
  type ContextSubLayerConfig,
  type FourwingsDeckSublayer,
  isFeatureInRange,
  type UserPointsTileLayer,
} from '@globalfishingwatch/deck-layers'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { frameTimeseriesToDateTimeseries } from 'features/reports/reports-timeseries-shared.utils'
import type { ComparisonGraphData } from 'features/reports/tabs/activity/ReportActivityPeriodComparisonGraph'
import { getGraphDataFromPoints } from 'features/timebar/timebar.utils'

export type PointsFeaturesToTimeseriesParams = {
  start: number
  end: number
  interval: FourwingsInterval
  startTimeProperty: string
  endTimeProperty?: string
  sublayers: (FourwingsDeckSublayer | ContextSubLayerConfig)[]
}

export const pointsFeaturesToTimeseries = (
  filteredFeatures: FilteredPolygons[],
  {
    start,
    end,
    interval,
    startTimeProperty,
    endTimeProperty,
    sublayers,
  }: PointsFeaturesToTimeseriesParams
): ReportGraphProps[] => {
  return filteredFeatures.map(({ contained }) => {
    const featureToTimeseries: ReportGraphProps = {
      interval,
      sublayers: sublayers.map((sublayer) => ({
        id: sublayer.id,
        legend: {
          color: sublayer.color,
          unit: sublayer.unit,
        },
      })),
      timeseries: [],
    }

    const valuesContainedRaw = getGraphDataFromPoints(contained as Feature<Point>[], {
      start,
      end,
      interval,
      sublayersLength: sublayers.length,
      startTimeProperty,
      endTimeProperty,
    })
    const valuesContained = frameTimeseriesToDateTimeseries(valuesContainedRaw as any)

    featureToTimeseries.timeseries = valuesContained.map(({ values, date }) => {
      return {
        date,
        min: values,
        max: values,
      } as ComparisonGraphData
    })
    return featureToTimeseries
  })
}

export type GetPointsTimeseriesParams = {
  features: FilteredPolygons[]
  instance: UserPointsTileLayer
}

export const getPointsTimeseries = ({ features, instance }: GetPointsTimeseriesParams) => {
  const { startTime, endTime, startTimeProperty, endTimeProperty, layers } = instance.props || {}

  const sublayers = layers?.flatMap((l) => l?.sublayers)

  if (!startTime || !endTime || !startTimeProperty) {
    // need to add empty timeseries because they are then used by their index
    return {
      timeseries: [],
      interval: 'MONTH',
      sublayers: [],
    } as ReportGraphProps
  }

  const interval = getFourwingsInterval(startTime, endTime)
  const params: PointsFeaturesToTimeseriesParams = {
    interval: interval,
    start: startTime,
    end: endTime,
    startTimeProperty,
    endTimeProperty,
    sublayers,
  }
  return pointsFeaturesToTimeseries(features, params)[0]
}

export const getPointsTimeseriesStats = ({ features, instance }: GetPointsTimeseriesParams) => {
  const { startTime, endTime, startTimeProperty, endTimeProperty } = instance.props || {}

  return {
    type: 'points' as const,
    total: features?.reduce((acc, { contained }) => {
      if (!contained) {
        return acc
      }
      if (!startTime && !endTime && !startTimeProperty && !endTimeProperty) {
        return acc + contained.length
      }
      const filteredPoints = contained.filter((feature) => {
        return isFeatureInRange(feature, {
          startTime: startTime!,
          endTime: endTime!,
          startTimeProperty: startTimeProperty!,
          endTimeProperty,
        })
      })
      return acc + filteredPoints.length
    }, 0),
  }
}
