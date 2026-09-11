import { area } from '@turf/turf'
import type { Feature, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { PolygonGeomCoords } from '@globalfishingwatch/data-transforms'
import {
  getPolygonsIntersection,
  getPolygonsUnion,
  toFiniteNumber,
} from '@globalfishingwatch/data-transforms'
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

/**
 * How many source areas a feature stands for. Precomputed tilesets union the areas that are
 * too small to survive tippecanoe's simplification into one aggregated feature, and record
 * how many went in as `count`. Everything else is worth one.
 */
function getFeatureCount(feature: { properties?: GeoJsonProperties }): number {
  const count = toFiniteNumber(feature.properties?.count)
  return count === undefined || count < 1 ? 1 : count
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
  reportArea,
  reportAreaProperties,
  sublayers,
}: GetPolygonsStatsParams): PolygonsReportGraphStats | undefined => {
  const featureGroup = features?.[0]
  if (!featureGroup) return undefined

  // Counts are of source areas, not of tile features: an aggregated feature stands for many,
  // and how many features a tileset splits them into changes with zoom.
  const containedCount = getFeaturesCount(featureGroup.contained)
  const overlappingCount = getFeaturesCount(featureGroup.overlapping)
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

    // km2 is the sort key, so it is computed for every polygon; the rest of the payload
    // (feature clone, label lookup) is only built for the TOP_AREAS_COUNT that survive the slice.
    const topAreaCandidates: { feature: any; km2: number }[] = []
    const addTopArea = (
      feature: any,
      geometry: Polygon | MultiPolygon,
      isWholePolygon: boolean
    ) => {
      // An aggregated feature is many areas at once, so it is not one of the top ones.
      if (getFeatureCount(feature) > 1) {
        return
      }
      // Properties only where the polygon is counted whole: an overlapping one is measured
      // after clipping, so its own area_km2 would overstate what is inside the report area.
      const km2 = getAreaKm2({ geometry, properties: isWholePolygon ? feature.properties : null })
      topAreaCandidates.push({ feature, km2 })
    }

    const polygonsToUnion: PolygonGeomCoords[] = []
    let aggregatedM2 = 0

    const containedFeatures = featureGroup.contained as Feature<Polygon | MultiPolygon>[]
    containedFeatures.forEach((feature) => {
      const geometry = feature.geometry
      if (geometry?.type !== 'Polygon' && geometry?.type !== 'MultiPolygon') {
        aggregatedM2 += getAreaKm2({ geometry: undefined, properties: feature.properties }) * 1e6
        return
      }
      // Contained polygons are already fully inside, no clipping needed.
      addTopArea(feature, geometry, true)
      polygonsToUnion.push(geometry.coordinates as PolygonGeomCoords)
    })

    // Clip overlapping polygons to the report area first so all geometries stay small.
    ;(featureGroup.overlapping as Feature<Polygon | MultiPolygon>[]).forEach((p) => {
      let clipped: ReturnType<typeof getPolygonsIntersection> = []
      try {
        clipped = getPolygonsIntersection(
          p.geometry.coordinates as PolygonGeomCoords,
          reportArea.coordinates as PolygonGeomCoords
        )
      } catch (e) {
        console.warn('Report polygon coverage: could not clip an overlapping polygon', e)
      }
      if (!clipped.length) {
        return
      }
      addTopArea(p, { type: 'MultiPolygon', coordinates: clipped }, false)
      polygonsToUnion.push(clipped)
    })

    let intersectionM2 = aggregatedM2
    if (polygonsToUnion.length > 0) {
      intersectionM2 += area({
        type: 'Feature',
        geometry: { type: 'MultiPolygon', coordinates: getPolygonsUnion(polygonsToUnion) },
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
      topAreas: topAreaCandidates
        .sort((a, b) => b.km2 - a.km2)
        .slice(0, TOP_AREAS_COUNT)
        .map(({ feature, km2 }): PolygonsReportTopArea => {
          const nameProperty = (feature.valueProperties as string[] | undefined)?.[0]
          // Leave geometries out of the atom
          const { geometry: _geometry, ...featureRef } = feature
          return {
            id: feature.id as string,
            feature: featureRef,
            label:
              (nameProperty ? feature.properties?.[nameProperty] : undefined) ??
              feature.value ??
              feature.id,
            km2,
            ratio: reportAreaM2 > 0 ? (km2 * 1_000_000) / reportAreaM2 : 0,
          }
        }),
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
