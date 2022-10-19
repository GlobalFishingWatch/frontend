import { useCallback, useEffect, useMemo, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { atom, selector, useRecoilState } from 'recoil'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { MULTILAYER_SEPARATOR } from '@globalfishingwatch/dataviews-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
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
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
  hasDataviewsFeatureError,
} from 'features/map/map-sources.hooks'
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
import { AsyncReducerStatus } from 'utils/async-slice'
import { Area, fetchAreaThunk, FetchAreaThunkParam } from 'features/areas/areas.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getUTCDateTime } from 'utils/dates'
import { filterByPolygon } from './analysis-geo.utils'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectAnalysisArea, selectShowTimeComparison } from './analysis.selectors'

export const mapTimeseriesAtom = atom<AnalysisGraphProps[] | undefined>({
  key: 'mapTimeseriesState',
  default: undefined,
})

export const selectMapTimeseries = selector({
  key: 'mapTimeseriesStateLoaded',
  get: ({ get }) => {
    const timeseries = get(mapTimeseriesAtom)
    return timeseries && timeseries.length > 0
  },
})

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export const useFilteredTimeSeries = () => {
  const [timeseries, setTimeseries] = useRecoilState(mapTimeseriesAtom)
  const [blur, setBlur] = useState(false)
  const analysisAreaGeometry = useSelector(selectAnalysisArea)?.geometry
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activityFeatures = useMapDataviewFeatures(temporalgridDataviews)
  const { areaId } = useSelector(selectAnalysisQuery)
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()

  const simplifiedGeometry = useMemo(() => {
    if (!analysisAreaGeometry) return null
    const simplifiedGeometry = simplify(analysisAreaGeometry, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [analysisAreaGeometry])

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = getUTCDateTime(timeComparison.start).toMillis()
    const compareStartMillis = getUTCDateTime(timeComparison.compareStart).toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }
  const computeTimeseries = useCallback(
    (layersWithFeatures: DataviewFeature[], geometry: Polygon | MultiPolygon) => {
      const features = layersWithFeatures
        .map(({ chunksFeatures }) =>
          chunksFeatures
            ? chunksFeatures.flatMap(({ active, features }) => (active && features ? features : []))
            : []
        )
        .filter((features) => features.length > 0)
      const filteredFeatures = filterByPolygon(features, geometry)
      const timeseries = featuresToTimeseries(filteredFeatures, {
        layersWithFeatures,
        showTimeComparison,
        compareDeltaMillis,
      })

      setTimeseries(timeseries)
      setBlur(false)
    },
    [showTimeComparison, compareDeltaMillis, setTimeseries]
  )

  const analysisEvolutionChange =
    analysisType === 'beforeAfter' || analysisType === 'periodComparison' ? 'time' : analysisType

  useEffect(() => {
    setTimeseries(undefined)
    setBlur(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, analysisEvolutionChange])

  useEffect(() => {
    if (timeseries) {
      setBlur(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeComparison])

  const activeSourceIdHash = activityFeatures
    .map(({ metadata }) => metadata?.timeChunks?.activeSourceId)
    .join(',')

  // Set blur when there new source data is fetched on timebar changes
  useEffect(() => {
    const hasActivityLayers = temporalgridDataviews.some(
      ({ category }) =>
        category === DataviewCategory.Activity || category === DataviewCategory.Detections
    )
    if (hasActivityLayers) {
      setBlur(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSourceIdHash])

  useEffect(() => {
    const activityFeaturesLoaded = areDataviewsFeatureLoaded(activityFeatures)
    if (activityFeaturesLoaded && simplifiedGeometry) {
      computeTimeseries(activityFeatures, simplifiedGeometry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeatures, simplifiedGeometry])

  const layersTimeseriesFiltered = useMemo(() => {
    if (showTimeComparison) {
      return removeTimeseriesPadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return filterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])

  return {
    blur,
    loading: !timeseries && !areDataviewsFeatureLoaded(activityFeatures),
    error: hasDataviewsFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}

export const useAnalysisArea = () => {
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const fitMapBounds = useMapFitBounds()
  const { dispatchQueryParams } = useLocationConnect()
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const contextDataviews = useSelector(selectContextAreasDataviews)
  const { areaId, sourceId, datasetId } = useSelector(selectAnalysisQuery)
  const analysisArea = useSelector(selectAnalysisArea) || ({} as Area)
  const { status, bounds } = analysisArea

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
      dispatchQueryParams({ analysis: { areaId, bounds, sourceId, datasetId } })
      fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
    },
    [dispatchQueryParams, areaId, sourceId, datasetId, fitMapBounds]
  )

  const fetchAnalysisArea = useCallback(
    (fetchParams: FetchAreaThunkParam) => {
      dispatch(fetchAreaThunk(fetchParams))
    },
    [dispatch]
  )

  useEffect(() => {
    if (areaId && !datasetId && contextDataviews?.length) {
      // Fallback for legacy url which doesn't contain datasetId in the url
      // trying to get the dataset from the context dataview
      const dataviewsIdBySource = contextDataviews.map(
        ({ id }) => id.split(MULTILAYER_SEPARATOR)[0]
      )
      const dataview = contextDataviews.find(
        ({ id }) => id === sourceId || dataviewsIdBySource.includes(id)
      )
      const datasetId = dataview?.datasets?.[0].id
      if (datasetId) {
        dispatchQueryParams({ analysis: { areaId, bounds, sourceId, datasetId } })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, datasetId])

  const areaName = contextDataviews?.find(({ id }) => id === sourceId)?.datasets?.[0].name
  useEffect(() => {
    if (areaId && datasetId) {
      fetchAnalysisArea({ datasetId, areaId, areaName })
    }
  }, [areaId, datasetId, fetchAnalysisArea, areaName])

  useEffect(() => {
    if (status === AsyncReducerStatus.Finished) {
      if (bounds) {
        setAnalysisBounds(bounds)
        setHighlightedArea()
      } else {
        console.warn('No area bounds')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, bounds])

  return analysisArea
}
