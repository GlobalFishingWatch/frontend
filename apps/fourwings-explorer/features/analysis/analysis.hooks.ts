import { useCallback, useEffect, useMemo } from 'react'
import type { Polygon, MultiPolygon, Point } from 'geojson'
import simplify from '@turf/simplify'
import { atom, useRecoilState } from 'recoil'
import { useRouter } from 'next/router'
import bbox from '@turf/bbox'
import type { LayerFeature } from '@globalfishingwatch/features-aggregate'
import type { TileContextAreaFeature } from '@globalfishingwatch/api-types'
import { useGeoTemporalLayers } from 'features/layers/layers.hooks'
import { useTimerange } from 'features/timebar/timebar.hooks'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
} from 'features/analysis/analysis-timeseries.utils'
import {
  areLayersFeatureLoaded,
  haslayersFeatureError,
  useMapLayerFeatures,
} from 'features/map/map-sources.hooks'
import { filterByPolygon } from './analysis-geo.utils'
import type { AnalysisGraphProps } from './AnalysisEvolutionGraph'

export const mapTimeseriesAtom = atom<AnalysisGraphProps[] | undefined>({
  key: 'mapTimeseriesState',
  default: undefined,
})

export type DateTimeSeries = {
  date: string
  values: number[]
}[]

export const useFilteredTimeSeries = (areaFeature: TileContextAreaFeature) => {
  const {
    query: { areaId },
  } = useRouter()
  const [{ start, end }] = useTimerange()
  const [timeseries, setTimeseries] = useRecoilState(mapTimeseriesAtom)

  const geotemporalLayers = useGeoTemporalLayers()
  const activityFeatures = useMapLayerFeatures(geotemporalLayers)

  const simplifiedFeature = useMemo(() => {
    if (!areaFeature) return null
    const simplifiedFeature = simplify(areaFeature.geometry, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedFeature.bbox = bbox(simplifiedFeature)
    return simplifiedFeature
  }, [areaFeature])

  const computeTimeseries = useCallback(
    (layersWithFeatures: LayerFeature[], geometry?: Point | Polygon | MultiPolygon) => {
      const features = layersWithFeatures.map(({ chunksFeatures }) =>
        chunksFeatures.flatMap(({ active, features }) => (active && features ? features : []))
      )
      const filteredFeatures = filterByPolygon(features, geometry)
      const timeseries = featuresToTimeseries(filteredFeatures, {
        layersWithFeatures,
      })

      setTimeseries(timeseries)
    },
    [setTimeseries]
  )

  useEffect(() => {
    setTimeseries(undefined)
     
  }, [areaId])

  useEffect(() => {
    const activityFeaturesLoaded = areLayersFeatureLoaded(activityFeatures)
    if (activityFeaturesLoaded) {
      computeTimeseries(activityFeatures, simplifiedFeature)
    }
     
  }, [activityFeatures, simplifiedFeature])

  const layersTimeseriesFiltered = useMemo(() => {
    if (start && end && timeseries) {
      return filterTimeseriesByTimerange(timeseries, start, end)
    }
  }, [end, start, timeseries])

  return {
    loading: !timeseries && !areLayersFeatureLoaded(activityFeatures),
    error: haslayersFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}
