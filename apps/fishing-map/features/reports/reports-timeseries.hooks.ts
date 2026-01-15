import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
  isDeckLayerReady,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import {
  type FourwingsFeature,
  type FourwingsInterval,
  getFourwingsInterval,
} from '@globalfishingwatch/deck-loaders'
import { useTrackDependencyChanges } from '@globalfishingwatch/react-hooks'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import {
  useReportAreaInViewport,
  useReportTitle,
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
  const reportTitle = useReportTitle()
  const isAreaInViewport = useReportAreaInViewport()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const timeComparisonHash = useSelector(selectTimeComparisonHash)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const reportGraphMode = getReportGraphMode(reportGraph)
  const isFirstLoad = useRef(true)

  const layerIds = useMemo(() => reportLayers.map((l) => l.id), [reportLayers])
  const layerIdsHash = layerIds.join(',')

  const layersStateHashAtom = useMemo(
    () => getLayersStateHashAtom(layerIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layerIdsHash]
  )

  const layersStateHash = useAtomValue(layersStateHashAtom)

  const instances = useMemo(
    () => getInstancesFromLayers(reportLayers, layersStateHash),
    [reportLayers, layersStateHash]
  )

  const reportLayersLength = reportLayers.length
  const titleHash = typeof reportTitle === 'string' ? reportTitle : reportTitle?.props.content

  const isLoaded = reportLayers.length > 0 && reportLayers.every(({ loaded }) => loaded)

  const isReadySync =
    reportLayers.length > 0 &&
    reportLayers.every(({ instance }) => isDeckLayerReady(instance) && instance.viewportLoaded)

  // Defer isReady validation to next tick to ensure rendering is complete
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    if (!isReadySync) {
      setIsReady(false)
      return
    }
    const timeoutId = setTimeout(() => {
      setIsReady(true)
    }, 10)
    return () => clearTimeout(timeoutId)
  }, [isReadySync])

  const onAreaChange = useEffectEvent(() => {
    reportLayers.forEach((layer) => {
      layer.instance?.forceRender?.()
    })
  })

  useLayoutEffect(() => {
    onAreaChange()
    isFirstLoad.current = true
  }, [area?.id])

  // Create processing hash to detect when we need to reprocess
  const processingHash = useMemo(() => {
    // Return empty if there is no area or no layers or
    // needs to wait for first layer load to complete
    if (!area?.id || !titleHash || reportLayersLength === 0 || (isFirstLoad.current && !isLoaded)) {
      return ''
    }

    return `${area.id}|${titleHash}|${reportCategory}|${reportSubCategory}|${reportGraphMode}|${timeComparisonHash}|${layersStateHash}|${reportBufferHash}`
  }, [
    area,
    isLoaded,
    titleHash,
    reportLayersLength,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    timeComparisonHash,
    layersStateHash,
    reportBufferHash,
  ])

  const lastProcessedHash = useRef('')
  const processingAbortRef = useRef<AbortController | null>(null)

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

  // Track the hash that triggered current processing to avoid aborting on isReady flicker
  const processingHashRef = useRef<string | null>(null)

  useEffect(() => {
    if (
      !isReady ||
      !isLoaded ||
      !processingHash ||
      processingHash === lastProcessedHash.current ||
      !isAreaInViewport ||
      !area?.geometry
    ) {
      return
    }

    // Only abort if we're starting processing for a DIFFERENT hash
    // This prevents aborting when isReady flickers but the hash is the same
    const hashChanged = processingHashRef.current !== processingHash
    if (hashChanged && processingAbortRef.current) {
      processingAbortRef.current.abort()
    }

    // If we're already processing this exact hash, don't start again
    if (!hashChanged && processingAbortRef.current) {
      return
    }

    processingHashRef.current = processingHash
    const abortController = new AbortController()
    processingAbortRef.current = abortController

    // Capture current values to avoid stale closures during async operations
    const currentHash = processingHash
    const currentInstances = [...instances]
    const currentArea = area

    const processFeatures = async () => {
      setReportState((prev) => {
        return { ...prev, isLoading: true }
      })

      try {
        const featuresFiltered: FilteredPolygons[][] = []
        for (const instance of currentInstances) {
          // Check for abort before each potentially long operation
          if (abortController.signal.aborted) {
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

            // Check abort before web worker call
            if (abortController.signal.aborted) {
              return
            }

            const filteredInstanceFeatures =
              currentArea.id === ENTIRE_WORLD_REPORT_AREA_ID
                ? ([
                    { contained: features, overlapping: [], instanceId: instance.id },
                  ] as FilteredPolygons[])
                : await filterCellsByPolygon(
                    {
                      layersCells: [features],
                      polygon: currentArea.geometry!,
                      mode,
                      instanceId: instance.id,
                    },
                    abortController.signal
                  )

            // Check abort after web worker returns (or if aborted during worker execution)
            if (abortController.signal.aborted) {
              return
            }

            featuresFiltered.push(filteredInstanceFeatures)
          }
        }

        // Final abort check before state update
        if (abortController.signal.aborted) {
          return
        }

        const timeseries = getTimeseries({
          featuresFiltered,
          instances: currentInstances,
        })

        setReportState((prev) => ({
          ...prev,
          isLoading: false,
          featuresFiltered,
          timeseries,
        }))
        isFirstLoad.current = false
        lastProcessedHash.current = currentHash
        processingHashRef.current = null
        processingAbortRef.current = null
      } catch (error) {
        // Ignore AbortError - this is expected when cancelling
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        // Only update state if not aborted
        if (!abortController.signal.aborted) {
          console.error('Error processing features:', error)
          setReportState((prev) => ({
            ...prev,
            ...initialReportState,
          }))
          lastProcessedHash.current = ''
          isFirstLoad.current = false
          processingHashRef.current = null
          processingAbortRef.current = null
        }
      }
    }

    processFeatures()
  }, [
    processingHash,
    area,
    instances,
    filterCellsByPolygon,
    setReportState,
    isAreaInViewport,
    isLoaded,
    isReady,
  ])

  useEffect(() => {
    return () => {
      processingAbortRef.current?.abort()
      processingAbortRef.current = null
      processingHashRef.current = null
    }
  }, [])

  useEffect(() => {
    const { featuresFiltered } = reportState
    if (!featuresFiltered || !instances.length) {
      return
    }

    const stats = getTimeseriesStats({
      instances,
      featuresFiltered,
      start,
      end,
    })

    setReportState((prev) => ({ ...prev, stats }))
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
