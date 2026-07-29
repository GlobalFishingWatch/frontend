import { area } from '@turf/turf'
import type { Feature, MultiPolygon, Polygon } from 'geojson'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { PolygonGeomCoords } from '@globalfishingwatch/data-transforms'
import { getPolygonsIntersection, getPolygonsUnion } from '@globalfishingwatch/data-transforms'
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

import type { FilteredPolygons } from 'features/reports/reports-geo.utils'
import type {
  PolygonsReportGraphStats,
  ReportGraphProps,
  ReportGraphStats,
} from 'features/reports/reports-timeseries.hooks'
import {
  getFourwingsTimeseries,
  getFourwingsTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import {
  getPointsTimeseries,
  getPointsTimeseriesStats,
} from 'features/reports/tabs/others/reports-points-timeseries.utils'
import { getPolygonsTimeseries } from 'features/reports/tabs/others/reports-polygons-timeseries.utils'


export type ReportFourwingsDeckLayer = FourwingsLayer | FourwingsVectorsTileLayer
export type ReportPointsDeckLayer = UserPointsTileLayer
export type ReportPolygonsDeckLayer = UserContextTileLayer
export type ReportDeckLayer =
  | ReportFourwingsDeckLayer
  | ReportPointsDeckLayer
  | ReportPolygonsDeckLayer

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
  reportArea?: Polygon | MultiPolygon
  sublayers?: ContextSubLayerConfig[]
}

function getCountsBySublayer(
  features: FilteredPolygons['contained' | 'overlapping'],
  sublayers: ContextSubLayerConfig[]
): number[] {
  return sublayers.map(
    (sublayer) =>
      features.filter((f) => isFeatureInFilters(f, sublayer.filters, sublayer.filterOperators))
        .length
  )
}

export const getPolygonsTimeseriesStats = ({
  features,
  reportArea,
  sublayers,
}: GetPolygonsStatsParams): PolygonsReportGraphStats | undefined => {
  const featureGroup = features?.[0]
  if (!featureGroup) return undefined

  const containedCount = featureGroup.contained.length
  const overlappingCount = featureGroup.overlapping.length
  const containedValues = sublayers ? getCountsBySublayer(featureGroup.contained, sublayers) : []
  const overlappingValues = sublayers
    ? getCountsBySublayer(featureGroup.overlapping, sublayers)
    : []

  if (!reportArea || (containedCount === 0 && overlappingCount === 0)) {
    return {
      type: 'polygons',
      contained: containedCount,
      overlapping: overlappingCount,
      containedValues,
      overlappingValues,
      areaCoverageRatio: 0,
      areaCoverageKm2: 0,
    }
  }

  try {
    const reportAreaFeature = {
      type: 'Feature' as const,
      geometry: reportArea,
      properties: {},
    } as Feature<Polygon | MultiPolygon>
    const reportAreaM2 = area(reportAreaFeature)

    // Clip overlapping polygons to the report area first so all geometries stay small.
    // Contained polygons are already fully inside, no clipping needed.
    const containedPolygons = featureGroup.contained as Feature<Polygon | MultiPolygon>[]
    const clippedOverlapping = (featureGroup.overlapping as Feature<Polygon | MultiPolygon>[])
      .map((p) => {
        const clipped = getPolygonsIntersection(
          p.geometry.coordinates as PolygonGeomCoords,
          reportArea.coordinates as PolygonGeomCoords
        )
        if (!clipped.length) return null
        return {
          type: 'Feature' as const,
          geometry: { type: 'MultiPolygon' as const, coordinates: clipped },
          properties: {},
        } as Feature<MultiPolygon>
      })
      .filter((p): p is Feature<MultiPolygon> => p !== null)

    // Single-pass batch union of all polygons
    const allPolygons = [...containedPolygons, ...clippedOverlapping]
    let intersectionM2 = 0
    if (allPolygons.length > 0) {
      const coords = allPolygons.map((p) => p.geometry.coordinates as PolygonGeomCoords)
      const unionCoords = getPolygonsUnion(coords)
      intersectionM2 = area({
        type: 'Feature',
        geometry: { type: 'MultiPolygon', coordinates: unionCoords },
        properties: {},
      })
    }

    return {
      type: 'polygons',
      contained: containedCount,
      overlapping: overlappingCount,
      containedValues,
      overlappingValues,
      areaCoverageRatio: reportAreaM2 > 0 ? intersectionM2 / reportAreaM2 : 0,
      areaCoverageKm2: intersectionM2 / 1_000_000,
    }
  } catch {
    return {
      type: 'polygons',
      contained: containedCount,
      overlapping: overlappingCount,
      containedValues,
      overlappingValues,
      areaCoverageRatio: 0,
      areaCoverageKm2: 0,
    }
  }
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

export type GetTimeseriesStatsParams<T extends ReportDeckLayer> = GetTimeseriesParams<T> &
  TimeRange & { reportArea?: Polygon | MultiPolygon }

export const getTimeseriesStats = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
  start,
  end,
  reportArea,
}: GetTimeseriesStatsParams<T>) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPolygonLayer(instance)) {
      const sublayers = instance.props.layers?.[0]?.sublayers as ContextSubLayerConfig[] | undefined
      const stats = getPolygonsTimeseriesStats({ features, reportArea, sublayers })
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
