import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import {
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  TimeChunk,
  TimeChunks,
  DEFAULT_CONTEXT_SOURCE_LAYER,
} from '@globalfishingwatch/layer-composer'
import type { Map, MapboxEvent } from '@globalfishingwatch/mapbox-gl'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { Bbox, WorkspaceAnalysisType } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import {
  selectAnalysisQuery,
  selectAnalysisTimeComparison,
  selectAnalysisTypeQuery,
} from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { useSourceInStyle } from 'features/map/map-features.hooks'
import { DEFAULT_WORKSPACE, FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/analysis/analysis-timeseries.utils'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import { filterByPolygon, getContextAreaGeometry } from './analysis-geo.utils'
import { ReportGeometry, selectAnalysisGeometry, setAnalysisGeometry } from './analysis.slice'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectShowTimeComparison } from './analysis.selectors'

export type LayerWithFeatures = {
  id: string
  features: GeoJSON.Feature<GeoJSON.Geometry>[]
  metadata: any
}

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export const useFilteredTimeSeries = () => {
  const map = useMapInstance()
  const analysisAreaGeometry = useSelector(selectAnalysisGeometry)
  const [timeseries, setTimeseries] = useState<AnalysisGraphProps[] | undefined>()
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const { duration, durationType, start, compareStart } = timeComparison || {}

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
    (layersWithFeatures: LayerWithFeatures[], geometry: Polygon | MultiPolygon) => {
      const getTimeseries = (
        layersWithFeatures: LayerWithFeatures[],
        geometry: Polygon | MultiPolygon
      ) => {
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
      }
      getTimeseries(layersWithFeatures, geometry)
    },
    [compareDeltaMillis, showTimeComparison]
  )

  const attachedListener = useRef<boolean>(false)
  const { areaId } = useSelector(selectAnalysisQuery)

  const getActivityLayers = useCallback(
    (style) => {
      const activityLayersMeta = style.metadata.generatorsMetadata
      const layers = Object.entries(activityLayersMeta).filter(([dataviewId]) => {
        // We are not interested (yet) in non-activity layers for time comparison
        return (
          !showTimeComparison ||
          (showTimeComparison && dataviewId === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID)
        )
      })
      return layers
    },
    [showTimeComparison]
  )

  useEffect(() => {
    // Used to re-attach the idle listener on area change
    setTimeseries(undefined)
    attachedListener.current = false
  }, [areaId])

  const analysisEvolutionChange =
    analysisType === 'beforeAfter' || analysisType === 'periodComparison' ? 'time' : analysisType
  useEffect(() => {
    // Used to re-attach the idle listener on type change
    setTimeseries(undefined)
    attachedListener.current = false
  }, [analysisEvolutionChange, duration, durationType, start, compareStart])

  useEffect(() => {
    if (!map || attachedListener.current || !simplifiedGeometry) return

    attachedListener.current = true

    const onMapIdle = (e: MapboxEvent) => {
      const style = (e.target as any).style.stylesheet
      const activityLayersWithFeatures = getActivityLayers(style).map(([dataviewId, metadata]) => {
        const chunks = (metadata as any).timeChunks as TimeChunks
        const allChunksFeatures = chunks.chunks.flatMap((chunk: TimeChunk) => {
          const sourceFeatures = map.querySourceFeatures(chunk.sourceId as string, {
            sourceLayer: TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
          })
          return sourceFeatures
        })
        return {
          id: dataviewId,
          features: allChunksFeatures,
          metadata,
        }
      })
      if (activityLayersWithFeatures.length) {
        computeTimeseries(activityLayersWithFeatures, simplifiedGeometry as MultiPolygon)
        map.off('idle', onMapIdle)
      }
    }

    map.on('idle', onMapIdle)
  }, [
    map,
    computeTimeseries,
    simplifiedGeometry,
    analysisType,
    showTimeComparison,
    duration,
    durationType,
    getActivityLayers,
  ])

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
  const attachedListener = useRef<boolean>(false)
  const { dispatchQueryParams } = useLocationConnect()
  const { areaId, sourceId } = useSelector(selectAnalysisQuery)
  const { updateFeatureState, cleanFeatureState } = useFeatureState(map)
  const [loaded, setLoaded] = useState(false)
  const sourceLoaded = useSourceInStyle(sourceId)
  const contextDataviews = useSelector(selectContextAreasDataviews)

  const getContextAreaFeatures = useCallback(
    (map: Map) => {
      const filter = ['==', 'gfw_id', parseInt(areaId)]
      const contextAreaFeatures = map.querySourceFeatures(sourceId, {
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        filter,
      })
      return contextAreaFeatures
    },
    [areaId, sourceId]
  )

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
    // Used to re-attach the idle listener on area change
    attachedListener.current = false
    setLoaded(false)
  }, [areaId])

  useEffect(() => {
    if (!map || attachedListener.current || !sourceLoaded) return

    attachedListener.current = true

    const onMapIdle = (e: MapboxEvent) => {
      const contextAreaFeatures = getContextAreaFeatures(map)
      const contextAreaGeometry = getContextAreaGeometry(contextAreaFeatures)

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
        setLoaded(true)
      }
      map.off('idle', onMapIdle)
    }
    if (map) {
      map.on('idle', onMapIdle)
    }
  }, [
    map,
    areaId,
    sourceLoaded,
    getContextAreaFeatures,
    setAnalysisBounds,
    fitMapBounds,
    dispatch,
    setHighlightedArea,
    contextDataviews,
    sourceId,
  ])

  return loaded
}

export const DURATION_TYPES_OPTIONS: SelectOption[] = [
  {
    id: 'days',
    label: t('common.days_other'),
  },
  {
    id: 'months',
    label: t('common.months_other'),
  },
]

const parseFullISODate = (d: string) => DateTime.fromISO(d).toUTC()

const parseYYYYMMDDDate = (d: string) => DateTime.fromISO(d).setZone('utc', { keepLocalTime: true })

const MIN_DATE = DEFAULT_WORKSPACE.availableStart.slice(0, 10)
const MAX_DATE = DEFAULT_WORKSPACE.availableEnd.slice(0, 10)
export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12

export const useAnalysisTimeCompareConnect = (analysisType: WorkspaceAnalysisType) => {
  const { dispatchQueryParams } = useLocationConnect()
  const fitMapBounds = useMapFitBounds()
  const { bounds } = useSelector(selectAnalysisQuery)
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const [errorMsg, setErrorMsg] = useState(null)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const durationType = timeComparison?.durationType
  const duration = timeComparison?.duration

  useEffect(() => {
    if (timeComparison) {
      if (analysisType === 'beforeAfter') {
        // make sure start is properly recalculated again in beforeAfter mode when coming from another mode
        const newStart = parseFullISODate(timeComparison.compareStart)
          .minus({ [timeComparison.durationType]: timeComparison.duration })
          .toISO()
        dispatchQueryParams({
          analysisTimeComparison: {
            ...timeComparison,
            start: newStart,
          },
        })
      }
      return
    }
    const baseStart = timebarStart || DEFAULT_WORKSPACE.availableStart
    const baseEnd = timebarEnd || DEFAULT_WORKSPACE.availableEnd
    const initialDuration = DateTime.fromISO(baseEnd).diff(DateTime.fromISO(baseStart), [
      'days',
      'months',
    ])
    const initialDurationType = initialDuration.as('days') >= 30 ? 'months' : 'days'
    const initialDurationValue =
      initialDurationType === 'days'
        ? Math.max(1, Math.round(initialDuration.days))
        : Math.min(MAX_MONTHS_TO_COMPARE, Math.round(initialDuration.months))

    const baseStartMinusOffset =
      analysisType === 'periodComparison'
        ? { years: 1 }
        : { [initialDurationType]: initialDurationValue }
    const initialStart = parseFullISODate(baseStart).minus(baseStartMinusOffset).toISO()
    const initialCompareStart = baseStart

    dispatchQueryParams({
      analysisTimeComparison: {
        start: initialStart,
        compareStart: initialCompareStart,
        duration: initialDurationValue,
        durationType: initialDurationType,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback(
    ({ newStart, newCompareStart, newDuration, newDurationType, error }) => {
      const compareStart = newCompareStart
        ? parseYYYYMMDDDate(newCompareStart).toISO()
        : parseFullISODate(timeComparison.compareStart as string).toISO()

      const duration = newDuration || timeComparison.duration
      const durationType = newDurationType || timeComparison.durationType

      const startFromCompareStart = parseFullISODate(compareStart).minus({
        [durationType]: duration,
      })

      let start: string
      if (analysisType === 'beforeAfter') {
        // In before/after mode, start of 1st period is calculated automatically depending on start of 2nd period (compareStart)
        start = startFromCompareStart.toISO()
      } else {
        start = newStart
          ? parseYYYYMMDDDate(newStart).toISO()
          : parseFullISODate(timeComparison.start).toISO()

        // If new duration is set, make sure there delta from start to compareStart is >= of new duration
        if (
          newDuration &&
          startFromCompareStart.toMillis() - parseFullISODate(timeComparison.start).toMillis() <= 0
        ) {
          start = startFromCompareStart.toISO()
        }
      }

      fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
      dispatchQueryParams({
        analysisTimeComparison: {
          start,
          compareStart,
          duration,
          durationType,
        },
      })
      if (error) {
        setErrorMsg(
          t(
            'analysis.errorPeriodComparisonDateRange',
            'Date range error. Comparison start must be after baseline start.'
          )
        )
      } else {
        setErrorMsg(null)
      }
    },
    [timeComparison, analysisType, fitMapBounds, bounds, dispatchQueryParams]
  )

  const onStartChange = useCallback(
    (e) => {
      update({
        newStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onCompareStartChange = useCallback(
    (e) => {
      update({
        newCompareStart: e.target.value,
        error: e.target.validity.rangeOverflow || e.target.validity.rangeUnderflow,
      })
    },
    [update]
  )

  const onDurationChange = useCallback(
    (e) => {
      if (
        (durationType === 'months' && e.target.value > MAX_MONTHS_TO_COMPARE) ||
        (durationType === 'days' && e.target.value > MAX_DAYS_TO_COMPARE)
      )
        return
      update({ newDuration: e.target.value })
    },
    [durationType, update]
  )

  const onDurationTypeSelect = useCallback(
    (option) => {
      if (option.id === 'months' && duration > MAX_MONTHS_TO_COMPARE) {
        update({ newDurationType: option.id, newDuration: MAX_MONTHS_TO_COMPARE })
      } else {
        update({ newDurationType: option.id })
      }
    },
    [duration, update]
  )

  const durationTypeOption = useMemo(() => {
    if (!timeComparison) return null
    return DURATION_TYPES_OPTIONS.find((o) => o.id === timeComparison.durationType)
  }, [timeComparison])

  return {
    onStartChange,
    onCompareStartChange,
    onDurationChange,
    onDurationTypeSelect,
    durationTypeOption,
    errorMsg,
    MIN_DATE,
    MAX_DATE,
  }
}
