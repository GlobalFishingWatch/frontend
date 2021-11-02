import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Feature, Polygon, MultiPolygon } from 'geojson'
import union from '@turf/union'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createAnalysisWorker from 'workerize-loader!./Analysis.worker'
import {
  quantizeOffsetToDate,
  TEMPORALGRID_SOURCE_LAYER_INTERACTIVE,
  Interval,
  pickActiveTimeChunk,
  TimeChunk,
  TimeChunks,
  DEFAULT_CONTEXT_SOURCE_LAYER,
} from '@globalfishingwatch/layer-composer'
import {
  getTimeSeries,
  getRealValues,
  TimeSeriesFrame,
} from '@globalfishingwatch/fourwings-aggregate'
import type { Map } from '@globalfishingwatch/mapbox-gl'
import { MapboxEvent } from '@globalfishingwatch/mapbox-gl'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from '@globalfishingwatch/dataviews-client'
import { SelectOption } from '@globalfishingwatch/ui-components'
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
import { DEFAULT_WORKSPACE } from 'data/config'
import { useMapStyle } from 'features/map/map.hooks'
import { selectAnalysisGeometry, setAnalysisGeometry } from './analysis.slice'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import * as AnalysisWorker from './Analysis.worker'
import { selectShowTimeComparison } from './analysis.selectors'

const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

type LayerWithFeatures = {
  id: string
  features: GeoJSON.Feature<GeoJSON.Geometry>[]
  metadata: any
}

type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

const frameTimeseriesToDateTimeseries = (
  frameTimeseries: TimeSeriesFrame[],
  sourceInterval: Interval,
  compareDeltaMillis?: number
): DateTimeSeries => {
  const dateFrameseries = frameTimeseries.map((frameValues) => {
    const { frame, ...rest } = frameValues
    const date = quantizeOffsetToDate(frame, sourceInterval)
    const compareDate = compareDeltaMillis
      ? new Date(date.getTime() + compareDeltaMillis).toISOString()
      : undefined
    return {
      values: Object.values(rest) as number[],
      date: date.toISOString(),
      compareDate,
    }
  })
  return dateFrameseries
}

const filterByTimerange = (timeseries: AnalysisGraphProps[], start: string, end: string) => {
  const startDate = DateTime.fromISO(start)
  const endDate = DateTime.fromISO(end)
  return timeseries?.map((layerTimeseries) => {
    return {
      ...layerTimeseries,
      timeseries: layerTimeseries?.timeseries.filter((current: any) => {
        const currentDate = DateTime.fromISO(current.date)
        return currentDate >= startDate && currentDate < endDate
      }),
    }
  })
}

export const useFilteredTimeSeries = () => {
  const map = useMapInstance()
  const mapStyle = useMapStyle()
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
      const getTimeseries = async (
        layersWithFeatures: LayerWithFeatures[],
        geometry: Polygon | MultiPolygon
      ) => {
        const filteredFeatures = await filterByPolygon(
          layersWithFeatures.map((l) => l.features),
          geometry
        )

        const timeseries = filteredFeatures.map((filteredFeatures, sourceIndex) => {
          const sourceMetadata = layersWithFeatures[sourceIndex].metadata
          const sourceNumSublayers = sourceMetadata.numSublayers
          // TODO handle multiple timechunks
          const sourceActiveTimeChunk = pickActiveTimeChunk(sourceMetadata.timeChunks)
          const sourceQuantizeOffset = sourceActiveTimeChunk.quantizeOffset
          const sourceInterval = sourceMetadata.timeChunks.interval
          const { values: valuesContainedRaw } = getTimeSeries(
            (filteredFeatures.contained || []) as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          )

          const valuesContained = frameTimeseriesToDateTimeseries(
            valuesContainedRaw,
            sourceInterval,
            compareDeltaMillis
          )

          const featuresContainedAndOverlapping = [
            ...(filteredFeatures.contained || []),
            ...(filteredFeatures.overlapping || []),
          ]
          const { values: valuesContainedAndOverlappingRaw } = getTimeSeries(
            featuresContainedAndOverlapping as any,
            sourceNumSublayers,
            sourceQuantizeOffset,
            sourceMetadata.aggregationOperation
          )

          const valuesContainedAndOverlapping = frameTimeseriesToDateTimeseries(
            valuesContainedAndOverlappingRaw,
            sourceInterval,
            compareDeltaMillis
          )

          const timeseries = valuesContainedAndOverlapping.map(({ values, date, compareDate }) => {
            const minValues = valuesContained.find((overlap) => overlap.date === date)?.values
            return {
              date,
              compareDate,
              // TODO take into account multiplier when calling getRealValue
              min: minValues ? getRealValues(minValues) : new Array(values.length).fill(0),
              max: getRealValues(values),
            }
          })

          return {
            timeseries,
            interval: sourceInterval,
            sublayers: sourceMetadata.sublayers,
          }
        })
        setTimeseries(timeseries)
      }
      // Make features serializable for worker
      const serializedLayerWithFeatures = layersWithFeatures.map((layerWithFeatures) => {
        return {
          ...layerWithFeatures,
          features: layerWithFeatures.features.map(({ properties, geometry }) => ({
            type: 'Feature' as any,
            properties,
            geometry,
          })),
        }
      })
      getTimeseries(serializedLayerWithFeatures, geometry)
    },
    [compareDeltaMillis]
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

  useEffect(() => {
    // Used to re-attach the idle listener on type change
    setTimeseries(undefined)
    attachedListener.current = false
  }, [analysisType, duration, durationType, start, compareStart])

  // SetTimeseries with empty actual timeseries arrays, for the descriptions to populate
  useEffect(() => {
    if (mapStyle) {
      const layersEntries = getActivityLayers(mapStyle)
      if (layersEntries.length && !timeseries) {
        const emptyTimeseries = layersEntries.map(([dataviewId, metadata]) => {
          return {
            timeseries: [],
            interval: (metadata as any).timeChunks.interval,
            sublayers: (metadata as any).sublayers,
          }
        })
        setTimeseries(emptyTimeseries)
      }
    }
  }, [mapStyle, getActivityLayers, timeseries])

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

  const removePadding = (timeseries?: AnalysisGraphProps[]) => {
    return timeseries?.map((timeserie) => {
      return {
        ...timeserie,
        timeseries: timeserie.timeseries?.filter(
          (time) => time.min[0] !== 0 || time.min[1] !== 0 || time.max[0] !== 0 || time.max[1] !== 0
        ),
      }
    })
  }

  const layersTimeseriesFiltered = useMemo(() => {
    if (showTimeComparison) {
      return removePadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return filterByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}

const getContextAreaGeometry = (contextAreaFeatures?: mapboxgl.MapboxGeoJSONFeature[]) => {
  const contextAreaGeometry = contextAreaFeatures?.reduce((acc, { geometry, properties }) => {
    const featureGeometry: Feature<Polygon> = {
      type: 'Feature',
      geometry: geometry as Polygon,
      properties,
    }
    if (!acc?.type) return featureGeometry
    return union(acc, featureGeometry, { properties } as any) as Feature<Polygon>
  }, {} as Feature<Polygon>)
  return contextAreaGeometry
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
        const areaName: string = name || id || value || ''
        const bounds = bbox(contextAreaGeometry) as Bbox
        if (bounds) {
          const wrappedBounds = wrapBBoxLongitudes(bounds) as Bbox
          setAnalysisBounds(wrappedBounds)
          fitMapBounds(wrappedBounds, { padding: 10 })
          dispatch(
            setAnalysisGeometry({
              geometry: contextAreaGeometry,
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
  ])

  return loaded
}

export const DURATION_TYPES_OPTIONS: SelectOption[] = [
  {
    id: 'days',
    label: 'days',
  },
  {
    id: 'months',
    label: 'months',
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
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const durationType = timeComparison?.durationType || 'months'
  const duration = timeComparison?.duration

  useEffect(() => {
    const baseStart = timebarStart || DEFAULT_WORKSPACE.availableEnd
    const baseEnd = timebarEnd || DEFAULT_WORKSPACE.availableEnd
    const duration = DateTime.fromISO(baseEnd).diff(DateTime.fromISO(baseStart), ['days', 'months'])
    const initialStart = parseFullISODate(baseStart).minus({ years: 1 }).toISO()
    const initialCompareStart = baseStart
    dispatchQueryParams({
      analysisTimeComparison: {
        start: initialStart,
        compareStart: initialCompareStart,
        duration: duration[durationType as 'days' | 'months'] || 1,
        durationType: durationType,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback(
    ({ newStart, newCompareStart, newDuration, newDurationType }) => {
      const compareStart = newCompareStart
        ? parseYYYYMMDDDate(newCompareStart).toISO()
        : parseFullISODate(timeComparison.compareStart as string).toISO()

      const duration = newDuration || timeComparison.duration
      const durationType = newDurationType || timeComparison.durationType

      let start: string
      if (analysisType === 'beforeAfter') {
        // In before/after mode, start of 1st period is calculated automatically depending on start of 2nd period (compareStart)
        start = parseYYYYMMDDDate(compareStart)
          .minus({ [durationType]: duration })
          .toISO()
      } else {
        start = newStart
          ? parseYYYYMMDDDate(newStart).toISO()
          : parseFullISODate(timeComparison.start).toISO()
      }

      dispatchQueryParams({
        analysisTimeComparison: {
          start,
          compareStart,
          duration,
          durationType,
        },
      })
    },
    [timeComparison, dispatchQueryParams, analysisType]
  )

  const onStartChange = useCallback(
    (e) => {
      update({ newStart: e.target.value })
    },
    [update]
  )

  const onCompareStartChange = useCallback(
    (e) => {
      update({ newCompareStart: e.target.value })
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
      if (option.id === 'months' && duration > MAX_MONTHS_TO_COMPARE)
        update({ newDurationType: option.id, newDuration: MAX_MONTHS_TO_COMPARE })
      else update({ newDurationType: option.id })
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
    MIN_DATE,
    MAX_DATE,
  }
}
