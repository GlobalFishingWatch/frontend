// Runs inside reports-polygons.workers.ts: keep imports free of deck.gl and anything that
// touches the DOM, type-only imports excepted.
import { area } from '@turf/turf'
import type { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson'

import type { PolygonGeomCoords } from '@globalfishingwatch/data-transforms'
import {
  getPolygonsIntersection,
  getPolygonsUnion,
  mergeFeatureParts,
  toFiniteNumber,
} from '@globalfishingwatch/data-transforms'

import type { FilteredPolygons } from 'features/_reports/reports-geo.utils'
import { filterByPolygon, getAreaKm2 } from 'features/_reports/reports-geo.utils'
import type {
  PolygonsReportGraphStats,
  PolygonsReportTopArea,
} from 'features/_reports/reports-timeseries.hooks'

export const TOP_AREAS_COUNT = 10

export type PolygonsCoverage = Pick<
  PolygonsReportGraphStats,
  'areaCoverageRatio' | 'areaCoverageKm2' | 'topAreas'
>

/**
 * How many source areas a feature stands for. Precomputed tilesets union the areas that are
 * too small to survive tippecanoe's simplification into one aggregated feature, and record
 * how many went in as `count`. Everything else is worth one.
 */
export function getFeatureCount(feature: { properties?: GeoJsonProperties }): number {
  const count = toFiniteNumber(feature.properties?.count)
  return count === undefined || count < 1 ? 1 : count
}

export type PolygonsCoverageParams = {
  featureGroup: FilteredPolygons
  reportArea: Polygon | MultiPolygon
  /** Only set when they describe `reportArea` as-is — see getAreaKm2. */
  reportAreaProperties?: Record<string, any> | null
}

export function getPolygonsCoverage({
  featureGroup,
  reportArea,
  reportAreaProperties,
}: PolygonsCoverageParams): PolygonsCoverage | undefined {
  try {
    const reportAreaM2 =
      getAreaKm2({ geometry: reportArea, properties: reportAreaProperties }) * 1_000_000

    // km2 is the sort key, so it is computed for every polygon; the rest of the payload
    // (feature clone, label lookup) is only built for the TOP_AREAS_COUNT that survive the slice.
    const topAreaCandidates: { feature: any; km2: number }[] = []
    const addTopArea = ({
      feature,
      geometry,
      clipped,
    }: {
      feature: any
      geometry: Polygon | MultiPolygon
      clipped: boolean
    }) => {
      // An aggregated feature is many areas at once, so it is not one of the top ones.
      if (getFeatureCount(feature) > 1) {
        return
      }
      // Properties only where the polygon is counted whole: an overlapping one is measured
      // after clipping, so its own area_km2 would overstate what is inside the report area.
      const km2 = getAreaKm2({ geometry, properties: clipped ? undefined : feature.properties })
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
      addTopArea({ feature, geometry, clipped: false })
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
      addTopArea({
        feature: p,
        geometry: { type: 'MultiPolygon', coordinates: clipped },
        clipped: true,
      })
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
    return undefined
  }
}

export type FilterPolygonsByAreaParams = {
  instanceId: string
  /** The parts of each feature that tiles split apart, see getRenderedFeatureGroups */
  featureGroups: Feature<Geometry>[][]
  areaGeometry: Polygon | MultiPolygon
  /** Only set when they describe `areaGeometry` as-is — see getAreaKm2. */
  areaProperties?: Record<string, any> | null
  /** Every feature counts as contained, without testing it against the area */
  skipFilter?: boolean
}

/**
 * The polygon layers half of getFeaturesFilteredByArea, kept off the main thread: merging the
 * tile parts, the containment tests and the coverage clipping all scale with the area size.
 */
export function filterPolygonsByArea({
  instanceId,
  featureGroups,
  areaGeometry,
  areaProperties,
  skipFilter = false,
}: FilterPolygonsByAreaParams): FilteredPolygons[] {
  const features = featureGroups.map(mergeFeatureParts)
  const filtered: FilteredPolygons[] = skipFilter
    ? [{ contained: features, overlapping: [], instanceId }]
    : filterByPolygon({
        layersCells: [features],
        polygon: areaGeometry,
        mode: 'polygon',
        instanceId,
      })
  return filtered.map((featureGroup) => ({
    ...featureGroup,
    coverage: getPolygonsCoverage({
      featureGroup,
      reportArea: areaGeometry,
      reportAreaProperties: areaProperties,
    }),
  }))
}
