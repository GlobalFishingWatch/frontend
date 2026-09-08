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

import type { FilteredPolygons } from 'features/_reports/reports-geo.utils'
import { getAreaKm2 } from 'features/_reports/reports-geo.utils'
import type {
  PolygonsReportGraphStats,
  PolygonsReportTopArea,
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

export const TOP_AREAS_COUNT = 10

export type GetPolygonsStatsParams = {
  features: FilteredPolygons[]
  reportArea?: Polygon | MultiPolygon
  /** Only set when they describe `reportArea` as-is — see getAreaKm2. */
  reportAreaProperties?: Record<string, any> | null
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
  reportAreaProperties,
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

  if (containedCount === 0 && overlappingCount === 0) {
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

  if (!reportArea) {
    // Area still loading: report the counts but claim no coverage, and let the recompute on
    // the arriving geometry fill it in
    return {
      type: 'polygons',
      contained: containedCount,
      overlapping: overlappingCount,
      containedValues,
      overlappingValues,
    }
  }

  try {
    const reportAreaM2 =
      getAreaKm2({ geometry: reportArea, properties: reportAreaProperties }) * 1_000_000

    const topAreas: PolygonsReportTopArea[] = []
    const addTopArea = (
      feature: any,
      geometry: Polygon | MultiPolygon,
      isWholePolygon: boolean
    ) => {
      // Properties only where the polygon is counted whole: an overlapping one is measured
      // after clipping, so its own area_km2 would overstate what is inside the report area.
      const km2 = getAreaKm2({ geometry, properties: isWholePolygon ? feature.properties : null })
      const nameProperty = (feature.valueProperties as string[] | undefined)?.[0]
      // Gleave geometryes out of atom
      const { geometry: _geometry, ...featureRef } = feature
      topAreas.push({
        id: feature.id as string,
        feature: featureRef,
        label:
          (nameProperty ? feature.properties?.[nameProperty] : undefined) ??
          feature.value ??
          feature.id,
        km2,
        ratio: reportAreaM2 > 0 ? (km2 * 1_000_000) / reportAreaM2 : 0,
      })
    }

    // Clip overlapping polygons to the report area first so all geometries stay small.
    // Contained polygons are already fully inside, no clipping needed.
    const containedPolygons = featureGroup.contained as Feature<Polygon | MultiPolygon>[]
    containedPolygons.forEach((p) => addTopArea(p, p.geometry, true))
    const clippedOverlapping = (featureGroup.overlapping as Feature<Polygon | MultiPolygon>[])
      .map((p) => {
        // ponytail: a single unclippable geometry is skipped rather than voiding the whole
        // coverage number. Tile-derived polygons make turf's clipper throw often enough.
        let clipped: ReturnType<typeof getPolygonsIntersection> = []
        try {
          clipped = getPolygonsIntersection(
            p.geometry.coordinates as PolygonGeomCoords,
            reportArea.coordinates as PolygonGeomCoords
          )
        } catch (e) {
          console.warn('Report polygon coverage: could not clip an overlapping polygon', e)
        }
        if (!clipped.length) return null
        const geometry = { type: 'MultiPolygon' as const, coordinates: clipped }
        addTopArea(p, geometry, false)
        return {
          type: 'Feature' as const,
          geometry,
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
      topAreas: topAreas.sort((a, b) => b.km2 - a.km2).slice(0, TOP_AREAS_COUNT),
    }
  } catch (e) {
    console.warn('Report polygon coverage: area computation failed', e)
    return {
      type: 'polygons',
      contained: containedCount,
      overlapping: overlappingCount,
      containedValues,
      overlappingValues,
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
  TimeRange & {
    reportArea?: Polygon | MultiPolygon
    reportAreaProperties?: Record<string, any> | null
  }

export const getTimeseriesStats = <T extends ReportDeckLayer>({
  featuresFiltered,
  instances,
  start,
  end,
  reportArea,
  reportAreaProperties,
}: GetTimeseriesStatsParams<T>) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (isInstanceOfPolygonLayer(instance)) {
      const sublayers = instance.props.layers?.[0]?.sublayers as ContextSubLayerConfig[] | undefined
      const stats = getPolygonsTimeseriesStats({
        features,
        reportArea,
        reportAreaProperties,
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
