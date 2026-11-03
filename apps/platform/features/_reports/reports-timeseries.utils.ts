import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { TimeRange } from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextSubLayerConfig,
  FourwingsLayer,
  FourwingsVectorsTileLayer,
} from '@globalfishingwatch/deck-layers'
import {
  ContextLayer,
  UserContextTileLayer,
  UserPointsTileLayer,
} from '@globalfishingwatch/deck-layers'
import { isFeatureInFilters } from '@globalfishingwatch/deck-loaders'

import type { FilteredPolygons } from 'features/_reports/reports-geo.utils'
import { getFeatureCount } from 'features/_reports/reports-polygons.utils'
import type {
  PolygonsReportGraphStats,
  ReportGraphProps,
  ReportGraphStats,
} from 'features/_reports/reports-timeseries.hooks'
import {
  getFourwingsTimeseries,
  getFourwingsTimeseriesStats,
} from 'features/_reports/tabs/activity/reports-activity-timeseries.utils'
import {
  getPointsTimeseries,
  getPointsTimeseriesStats,
} from 'features/_reports/tabs/others/reports-points-timeseries.utils'
import { getPolygonsTimeseries } from 'features/_reports/tabs/others/reports-polygons-timeseries.utils'

export type ReportFourwingsDeckLayer = FourwingsLayer | FourwingsVectorsTileLayer
export type ReportPointsDeckLayer = UserPointsTileLayer
export type ReportPolygonsDeckLayer = UserContextTileLayer
export type ReportDeckLayer =
  ReportFourwingsDeckLayer | ReportPointsDeckLayer | ReportPolygonsDeckLayer

export type GetTimeseriesParams<T extends ReportDeckLayer> = {
  featuresFiltered: FilteredPolygons[][]
  instances: T[]
}

export const isInstanceOfPointsLayer = (instance: ReportDeckLayer) => {
  return instance instanceof UserPointsTileLayer
}

export const isInstanceOfPolygonLayer = (instance: ReportDeckLayer) => {
  return instance instanceof UserContextTileLayer || instance instanceof ContextLayer
}

export type GetPolygonsStatsParams = {
  features: FilteredPolygons[]
  sublayers?: ContextSubLayerConfig[]
}

function getFeaturesCount(features: FilteredPolygons['contained' | 'overlapping']): number {
  return features.reduce((acc, feature) => acc + getFeatureCount(feature), 0)
}

function getCountsBySublayer(
  features: FilteredPolygons['contained' | 'overlapping'],
  sublayers: ContextSubLayerConfig[]
): number[] {
  return sublayers.map((sublayer) =>
    features.reduce((acc, feature) => {
      const isInFilters = isFeatureInFilters(feature, sublayer.filters, sublayer.filterOperators)
      return isInFilters ? acc + getFeatureCount(feature) : acc
    }, 0)
  )
}

export const getPolygonsTimeseriesStats = ({
  features,
  sublayers,
}: GetPolygonsStatsParams): PolygonsReportGraphStats | undefined => {
  const featureGroup = features?.[0]
  if (!featureGroup) return undefined

  // Counts are of source areas, not of tile features: an aggregated feature stands for many,
  // and how many features a tileset splits them into changes with zoom.
  const counts: PolygonsReportGraphStats = {
    type: 'polygons',
    contained: getFeaturesCount(featureGroup.contained),
    overlapping: getFeaturesCount(featureGroup.overlapping),
    containedValues: sublayers ? getCountsBySublayer(featureGroup.contained, sublayers) : [],
    overlappingValues: sublayers ? getCountsBySublayer(featureGroup.overlapping, sublayers) : [],
  }

  if (counts.contained === 0 && counts.overlapping === 0) {
    return { ...counts, areaCoverageRatio: 0, areaCoverageKm2: 0 }
  }

  // Coverage is the expensive clipping and union, computed in the worker with the filtering
  // (see getPolygonsCoverage). Undefined when it failed there, so only the counts are reported.
  return { ...counts, ...featureGroup.coverage }
}

export const getTimeseries = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
}: GetTimeseriesParams<T>) => {
  const timeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPolygonLayer(instance)) {
      const polygonsTimeseries = getPolygonsTimeseries({
        features,
        instance: instance as ReportPolygonsDeckLayer,
      })
      timeseries.push({ ...polygonsTimeseries, id: instance.id })
    } else if (isInstanceOfPointsLayer(instance)) {
      const pointsTimeseries = getPointsTimeseries({ instance, features })
      if (pointsTimeseries) {
        timeseries.push({ ...pointsTimeseries, id: instance.id })
      }
    } else {
      const fourwingsTimeseries = getFourwingsTimeseries({ instance: instance, features })
      if (fourwingsTimeseries) {
        timeseries.push({ ...fourwingsTimeseries, id: instance.id })
      }
    }
  })
  return timeseries
}

export type GetTimeseriesStatsParams<T extends ReportDeckLayer> = GetTimeseriesParams<T> & TimeRange

export const getTimeseriesStats = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
  start,
  end,
}: GetTimeseriesStatsParams<T>) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPolygonLayer(instance)) {
      const sublayers = instance.props.layers?.[0]?.sublayers as ContextSubLayerConfig[] | undefined
      const stats = getPolygonsTimeseriesStats({
        features,
        sublayers,
      })
      if (stats) {
        timeseriesStats[instance.id] = stats
      }
    } else if (isInstanceOfPointsLayer(instance)) {
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
    const intervalStart =
      DateTime.fromISO(start, { zone: 'utc' })
        .startOf(layerTimeseries.interval.toLowerCase() as DateTimeUnit)
        .toISO() || start
    const intervalEnd =
      DateTime.fromISO(end, { zone: 'utc' })
        .startOf(layerTimeseries.interval.toLowerCase() as DateTimeUnit)
        .toISO() || end
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current) => {
        const inRange =
          intervalStart === intervalEnd
            ? current.date === intervalStart
            : current.date >= intervalStart && current.date <= intervalEnd
        return (current.max.some((v) => v !== 0) || current.min.some((v) => v !== 0)) && inRange
      }),
    }
  })
}
