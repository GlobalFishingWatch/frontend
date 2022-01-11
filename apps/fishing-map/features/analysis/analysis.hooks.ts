import { useCallback, useEffect, useMemo, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { Bbox } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  selectAnalysisQuery,
  selectAnalysisTimeComparison,
  selectAnalysisTypeQuery,
} from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { DataviewFeature, useMapDataviewFeatures } from 'features/map/map-sources.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/analysis/analysis-timeseries.utils'
import {
  selectActiveTemporalgridDataviews,
  selectContextAreasDataviews,
} from 'features/dataviews/dataviews.selectors'
import { filterByPolygon, getContextAreaGeometry } from './analysis-geo.utils'
import { ReportGeometry, selectAnalysisGeometry, setAnalysisGeometry } from './analysis.slice'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectShowTimeComparison } from './analysis.selectors'

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export const useFilteredTimeSeries = () => {
  const analysisAreaGeometry = useSelector(selectAnalysisGeometry)
  const [timeseries, setTimeseries] = useState<AnalysisGraphProps[] | undefined>()
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activityFeatures = useMapDataviewFeatures(temporalgridDataviews)
  const { areaId } = useSelector(selectAnalysisQuery)

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = DateTime.fromISO(timeComparison.start).toUTC().toMillis()
    const compareStartMillis = DateTime.fromISO(timeComparison.compareStart).toUTC().toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }

  const simplifiedGeometry = useMemo(() => {
    if (!analysisAreaGeometry) return null
    const simplifiedGeometry = simplify(analysisAreaGeometry?.geometry as Polygon | MultiPolygon, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [analysisAreaGeometry])

  const computeTimeseries = useCallback(
    (layersWithFeatures: DataviewFeature[], geometry: Polygon | MultiPolygon) => {
      const filteredFeatures = filterByPolygon(
        layersWithFeatures.map((l) => l.features),
        geometry
      )
      const timeseries = featuresToTimeseries(filteredFeatures, {
        layersWithFeatures,
        showTimeComparison,
        compareDeltaMillis,
      })
      setTimeseries(timeseries)
    },
    [compareDeltaMillis, showTimeComparison]
  )

  const analysisEvolutionChange =
    analysisType === 'beforeAfter' || analysisType === 'periodComparison' ? 'time' : analysisType

  useEffect(() => {
    setTimeseries(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, analysisEvolutionChange])

  useEffect(() => {
    const activityFeaturesLoaded = activityFeatures.every(({ loaded }) => loaded)
    if (!timeseries && activityFeaturesLoaded && simplifiedGeometry) {
      computeTimeseries(activityFeatures, simplifiedGeometry as MultiPolygon)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeatures, computeTimeseries, simplifiedGeometry])

  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()

  const layersTimeseriesFiltered = useMemo(() => {
    if (showTimeComparison) {
      return removeTimeseriesPadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return filterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}

export const useAnalysisGeometry = () => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const fitMapBounds = useMapFitBounds()
  const { dispatchQueryParams } = useLocationConnect()
  const { areaId, sourceId } = useSelector(selectAnalysisQuery)
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const geometryDataview = useMemo(
    () => ({
      id: sourceId,
      config: { filter: ['==', 'gfw_id', parseInt(areaId)] },
    }),
    [areaId, sourceId]
  )
  const geometryFeatures = useMapDataviewFeatures(geometryDataview)?.[0]
  const contextDataviews = useSelector(selectContextAreasDataviews)

  const setHighlightedArea = useCallback(() => {
    cleanFeatureState('highlight')
    const featureState = {
      source: sourceId,
      sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
      id: areaId,
    }
    updateFeatureState([featureState], 'highlight')
  }, [areaId, cleanFeatureState, sourceId, updateFeatureState])

  const setAnalysisBounds = useCallback(
    (bounds: Bbox) => {
      dispatchQueryParams({ analysis: { areaId, bounds, sourceId } })
    },
    [areaId, sourceId, dispatchQueryParams]
  )

  useEffect(() => {
    if (geometryFeatures.loaded && !analysisGeometry) {
      const contextAreaGeometry = getContextAreaGeometry(geometryFeatures.features)
      debugger
      if (contextAreaGeometry && contextAreaGeometry.type === 'Feature') {
        const { name, value, id } = contextAreaGeometry.properties || {}
        const layerName = contextDataviews.find(({ id }) => id === sourceId)?.datasets?.[0].name
        const areaName: string = name || id || value || layerName || ''
        const bounds = bbox(contextAreaGeometry) as Bbox
        if (bounds) {
          const wrappedBounds = wrapBBoxLongitudes(bounds) as Bbox
          setAnalysisBounds(wrappedBounds)
          fitMapBounds(wrappedBounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
          dispatch(
            setAnalysisGeometry({
              geometry: contextAreaGeometry as ReportGeometry,
              name: areaName,
              bounds: wrappedBounds,
            })
          )
          setHighlightedArea()
        } else {
          console.warn('No area bounds')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometryFeatures])

  return geometryFeatures.loaded || analysisGeometry !== undefined
}
