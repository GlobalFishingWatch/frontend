import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import { atom, useAtom, useAtomValue } from 'jotai'
import type { DateTimeUnit } from 'luxon'
import memoizeOne from 'memoize-one'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import {
  getLayersStateHashAtom,
  groupContextDataviews,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer , UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import {
  type FourwingsFeature,
  type FourwingsInterval,
  getFourwingsInterval,
} from '@globalfishingwatch/deck-loaders'
import { useDebounce } from '@globalfishingwatch/react-hooks'

// import { useTrackDependencyChanges } from '@globalfishingwatch/react-hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
// import { useTrackDependencyChanges } from '@globalfishingwatch/react-hooks'
import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import {
  useReportAreaInViewport,
} from 'features/reports/report-area/area-reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
  selectTimeComparisonHash,
} from 'features/reports/report-area/area-reports.selectors'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import { selectReportCategory, selectReportSubCategory } from 'features/reports/reports.selectors'
import type { ReportActivityGraph } from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import type { FilterByPolygonMode, FilteredPolygons } from 'features/reports/reports-geo.utils'
import { useFilterCellsByPolygonWorker } from 'features/reports/reports-geo.utils.workers.hooks'
import {
  filterTimeseriesByTimerange,
  getTimeseries,
  getTimeseriesStats,
} from 'features/reports/reports-timeseries.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

export interface EvolutionGraphData {
  date: string
  compareDate?: string
  min: number[]
  max: number[]
}

interface ReportSublayerGraph {
  id: string
  legend: {
    color?: string
    unit?: string
  }
}

export type ReportGraphMode = 'evolution' | 'time' | 'loading'

export function getReportGraphMode(reportActivityGraph: ReportActivityGraph): ReportGraphMode {
  return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
    ? 'time'
    : 'evolution'
}

export interface ReportGraphProps {
  timeseries: (EvolutionGraphData & { mode?: ReportGraphMode })[]
  sublayers: ReportSublayerGraph[]
  interval: FourwingsInterval
  mode?: ReportGraphMode
}

export type FourwingsReportGraphStats = {
  type: 'fourwings'
  min: number
  max: number
  mean: number
}

export type PointsReportGraphStats = {
  type: 'points'
  total: number
  values: number[]
  count: number
}

export type ReportGraphStats = Record<string, FourwingsReportGraphStats | PointsReportGraphStats>

interface ReportState {
  isLoading: boolean
  timeseries: ReportGraphProps[] | undefined
  featuresFiltered: FilteredPolygons[][] | undefined
  stats: ReportGraphStats | undefined
}

const initialReportState: ReportState = {
  isLoading: false,
  timeseries: undefined,
  featuresFiltered: undefined,
  stats: undefined,
}

const reportStateAtom = atom(initialReportState)

export function useTimeseriesStats() {
  return useAtomValue(reportStateAtom)?.stats
}

export const useReportInstances = () => {
  const currentCategory = useSelector(selectReportCategory)
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  const reportComparisonDataviews = useSelector(selectReportComparisonDataviews)
  let ids = ['']

  if (currentCategoryDataviews?.length > 0) {
    if (
      currentCategory === ReportCategory.Activity ||
      currentCategory === ReportCategory.Detections
    ) {
      ids = [getMergedDataviewId(currentCategoryDataviews)]
    } else if (currentCategory === ReportCategory.Others) {
      ids = Object.values(groupContextDataviews(currentCategoryDataviews)).map((dataviews) =>
        getMergedDataviewId(dataviews)
      )
    } else {
      ids = currentCategoryDataviews.map((dataview) => dataview.id)
    }
    if (reportComparisonDataviews?.length > 0) {
      ids.push(...reportComparisonDataviews.map((dataview) => dataview.id))
    }
  }
  const reportLayerInstances = useGetDeckLayers<FourwingsLayer>(ids)
  return reportLayerInstances
}

export const useReportFeaturesLoading = () => {
  return useAtomValue(reportStateAtom)?.isLoading
}

// Memoized function to extract instances to prevent unnecessary re-renders
// layersStateHash is used as a cache key to ensure memoizeOne detects changes
const getInstancesFromLayers = memoizeOne(
  (
    reportLayers: DeckLayerAtom<FourwingsLayer | UserPointsTileLayer>[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    layersStateHash: string
  ) => reportLayers.map((l) => l.instance)
)

const useReportTimeseries = (
  reportLayers: DeckLayerAtom<FourwingsLayer | UserPointsTileLayer>[]
) => {
  const [reportState, setReportState] = useAtom(reportStateAtom)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const { start, end } = useSelector(selectTimeRange)
  const availableIntervals = uniq(
    reportLayers.flatMap((layer) => layer.instance.props.availableIntervals as FourwingsInterval[])
  )
  const interval = getFourwingsInterval(start, end, availableIntervals)
  const isAreaInViewport = useReportAreaInViewport()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const timeComparisonHash = useSelector(selectTimeComparisonHash)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const reportGraphMode = getReportGraphMode(reportGraph)

  const layerIds = useMemo(() => reportLayers.map((l) => l.id), [reportLayers])
  const layerIdsHash = layerIds.join(',')

  const layersStateHashAtom = useMemo(
    () => getLayersStateHashAtom(layerIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layerIdsHash]
  )

  const lastProcessedHash = useRef('')
  const layersStateHash = useAtomValue(layersStateHashAtom)

  const instances = useMemo(
    () => getInstancesFromLayers(reportLayers, layersStateHash),
    [reportLayers, layersStateHash]
  )
  const debouncedTime = Math.max(...reportLayers.map(({ instance }) => instance.debounceTime || 0), 1)
  const debouncedAreaId = useDebounce(area?.id, debouncedTime)

  const isLoaded = useMemo(() => {
    const isLoaded =
      reportLayers.length > 0 &&
      reportLayers.every(({ instance, loaded }) => instance.isLoaded && loaded)
    return isLoaded
  }, [reportLayers])
  const reportLayersLength = reportLayers.length

  // Create processing hash to detect when we need to reprocess
  const processingHash = useMemo(() => {
    // Only return empty if we truly have no area or no layers at all
    // isLoaded can be temporarily false during layer transitions
    if (!debouncedAreaId || reportLayersLength === 0) return ''
    // Include isLoaded in the hash so processing runs when layers finish loading
    return `${debouncedAreaId}|${reportCategory}|${reportSubCategory}|${reportGraphMode}|${timeComparisonHash}|${layersStateHash}|${reportBufferHash}`
  }, [
    debouncedAreaId,
    reportLayersLength,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    timeComparisonHash,
    layersStateHash,
    reportBufferHash
  ])

  // Reset state when critical parameters change
  useLayoutEffect(() => {
    if (!isAreaInViewport) {
      return
    }
    const shouldShowLoading =
      reportCategory && reportCategory !== 'events' && reportCategory !== 'others'

    setReportState((prev) => ({
      ...prev,
      ...initialReportState,
      isLoading:
        reportLayersLength > 0 &&
        (shouldShowLoading || processingHash !== lastProcessedHash.current),
    }))
    lastProcessedHash.current = ''
  }, [
    area,
    interval,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    reportLayersLength,
    setReportState,
    processingHash,
    isAreaInViewport,
  ])

  useEffect(() => {
    if (
      !processingHash ||
      processingHash === lastProcessedHash.current ||
      !isAreaInViewport ||
      !isLoaded ||
      !area?.geometry ||
      !debouncedAreaId
    ) {
      return
    }

    const processFeatures = async () => {
      setReportState((prev) => {
        return { ...prev, isLoading: true }
      })
      try {
        const featuresFiltered: FilteredPolygons[][] = []
        for (const instance of instances) {
          const viewportLoaded = instance instanceof FourwingsLayer ? instance.getLayer()?.viewportLoaded : instance.viewportLoaded
          if (instance.isLoaded === false || !viewportLoaded) {
            // Layer is in transitional state - abort and let the effect re-run
            // when the layer state updates
            return
          }

          const isUserPointsTileLayer = instance instanceof UserPointsTileLayer
          const hasTimeFilter = instance.props.startTime || instance.props.endTime

          const features = instance?.getData?.(
            isUserPointsTileLayer
              ? {
                  includeNonTemporalFeatures: true,
                  skipTemporalFilter: !hasTimeFilter,
                }
              : {}
          ) as FourwingsFeature[]

          const error = instance?.getError?.()
          if (error || !features?.length) {
            featuresFiltered.push([
              { contained: [], overlapping: [], error, instanceId: instance.id },
            ])
          } else {
            let mode: FilterByPolygonMode = 'cell'
            if (instance.props.category === 'environment') {
              mode = 'cellCenter'
            } else if (
              instance.props.category === 'user' ||
              instance.props.category === 'context'
            ) {
              mode = 'point'
            }

            const filteredInstanceFeatures =
              area.id === ENTIRE_WORLD_REPORT_AREA_ID
                ? ([
                    { contained: features, overlapping: [], instanceId: instance.id },
                  ] as FilteredPolygons[])
                : await filterCellsByPolygon({
                    layersCells: [features],
                    polygon: area.geometry!,
                    mode,
                    instanceId: instance.id,
                  })
            featuresFiltered.push(filteredInstanceFeatures)
          }
        }

        const timeseries = getTimeseries({
          featuresFiltered,
          instances,
        })

        setReportState((prev) => ({
          ...prev,
          isLoading: false,
          featuresFiltered,
          timeseries,
        }))
        lastProcessedHash.current = processingHash
      } catch (error) {
        console.error('Error processing features:', error)
        setReportState((prev) => ({
          ...prev,
          ...initialReportState,
        }))
        lastProcessedHash.current = ''
      }
    }

    processFeatures()
  }, [
    processingHash,
    area,
    debouncedAreaId,
    instances,
    filterCellsByPolygon,
    setReportState,
    isAreaInViewport,
    isLoaded,
  ])

  useEffect(() => {
    const { featuresFiltered } = reportState
    if (!featuresFiltered || !instances.length) {
      return
    }

    setReportState((prev) => {
      if (!prev.featuresFiltered || !instances.length) {
        return prev
      }
      const stats = getTimeseriesStats({
        instances,
        featuresFiltered: prev.featuresFiltered,
        start,
        end,
      })
      return { ...prev, stats }
    })
    // Only stats needs to recalculate on start and end changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportState.featuresFiltered, instances, start, end, setReportState])

  return reportState
}

// Run once only in ReportActivityGraph.tsx and ReportEnvironmnet.tsx
export const useComputeReportTimeSeries = () => {
  const reportLayers = useReportInstances()
  useReportTimeseries(reportLayers)
}

export const useReportTimeSeriesErrors = () => {
  const { featuresFiltered } = useAtomValue(reportStateAtom)
  return featuresFiltered?.map((f) => f.flatMap((ff) => ff.error || []).join(','))
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const { timeseries } = useAtomValue(reportStateAtom)
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const showTimeComparison = useSelector(selectShowTimeComparison)

  return useMemo(() => {
    if (!timeseries?.length) return []
    const availableIntervals = uniq((timeseries || []).map((t) => t?.interval))
    const interval = getFourwingsInterval(timebarStart, timebarEnd, availableIntervals)

    const startNormalisedByInterval =
      timebarStart && interval
        ? getUTCDateTime(timebarStart)
            .startOf(interval.toLowerCase() as DateTimeUnit)
            .toISO()
        : null
    const endNormalisedByInterval =
      timebarEnd && interval
        ? getUTCDateTime(timebarEnd)
            .startOf(interval.toLowerCase() as DateTimeUnit)
            .toISO()
        : null

    if (!showTimeComparison && startNormalisedByInterval && endNormalisedByInterval) {
      const memoizedFilteredTimeseries = memoizedFilterTimeseriesByTimerange(
        timeseries,
        startNormalisedByInterval,
        endNormalisedByInterval
      )
      return memoizedFilteredTimeseries
    }
    return timeseries
  }, [timeseries, timebarStart, timebarEnd, showTimeComparison])
}

export const useReportFilteredFeatures = () => {
  return useAtomValue(reportStateAtom)?.featuresFiltered
}
