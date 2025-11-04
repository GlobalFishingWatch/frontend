import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import { atom, useAtom, useAtomValue } from 'jotai'
import type { DateTimeUnit } from 'luxon'
import memoizeOne from 'memoize-one'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import { groupContextDataviews, useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { UserPointsTileLayer } from '@globalfishingwatch/deck-layers'
import {
  type FourwingsFeature,
  type FourwingsInterval,
  getFourwingsInterval,
} from '@globalfishingwatch/deck-loaders'

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

interface EvolutionGraphData {
  date: string
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
  }
  const reportLayerInstances = useGetDeckLayers<FourwingsLayer>(ids)
  return reportLayerInstances
}

export const useReportFeaturesLoading = () => {
  return useAtomValue(reportStateAtom)?.isLoading
}

const useReportTimeseries = (
  reportLayers: DeckLayerAtom<FourwingsLayer | UserPointsTileLayer>[]
) => {
  const [reportState, setReportState] = useAtom(reportStateAtom)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const isAreaInViewport = useReportAreaInViewport()
  const { start, end } = useTimerangeConnect()
  const interval = getFourwingsInterval(start, end)
  const reportTitle = useReportTitle()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const timeComparisonHash = useSelector(selectTimeComparisonHash)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const reportGraphMode = getReportGraphMode(reportGraph)
  const reportStateCacheHash = useRef('')

  const instancesChunkHash = reportLayers
    ?.flatMap(({ instance }) => {
      if ('cacheHash' in instance && instance.cacheHash) {
        return instance.cacheHash
      }
      if ('getChunk' in instance && instance.getChunk) {
        const { bufferedStart, bufferedEnd, interval } = instance.getChunk()
        return `${instance.id}-${interval}-${bufferedStart}-${bufferedEnd}`
      }
      return `${instance.id}`
    })
    .join(',')

  const instances = useMemo(
    () => reportLayers.map((l) => l.instance),
    // We need to update the instances when the instancesChunkHash or the reportBufferHash changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reportLayers, instancesChunkHash, reportBufferHash, isAreaInViewport]
  )

  const isLoaded = reportLayers?.length
    ? reportLayers.every(({ instance, loaded }) => instance.isLoaded && loaded)
    : false

  useLayoutEffect(() => {
    reportStateCacheHash.current = ''
    setReportState((prev) => ({
      ...prev,
      ...initialReportState,
      isLoading: reportCategory && reportCategory !== 'events' && reportCategory !== 'others',
    }))
    // We want to clean the reportState when any of these params changes to avoid using old data until it loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    area,
    interval,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    reportBufferHash,
    instancesChunkHash,
    timeComparisonHash,
  ])

  useEffect(() => {
    const newHash = area
      ? `${reportTitle}|${reportCategory}|${reportSubCategory}|${reportGraphMode}|${timeComparisonHash}|${instancesChunkHash}|${isLoaded}|${reportBufferHash}`
      : ''
    reportStateCacheHash.current = newHash
  }, [
    area,
    reportTitle,
    isLoaded,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    timeComparisonHash,
    instancesChunkHash,
    reportBufferHash,
  ])

  useEffect(() => {
    const processFeatures = async () => {
      if (!area?.geometry) {
        return
      }

      setReportState((prev) => ({ ...prev, isLoading: true }))
      try {
        const featuresFiltered: FilteredPolygons[][] = []
        for (const instance of instances) {
          const isUserPointsTileLayer = instance instanceof UserPointsTileLayer
          const features = instance?.getData?.(
            isUserPointsTileLayer
              ? {
                  includeNonTemporalFeatures: true,
                }
              : {}
          ) as FourwingsFeature[]
          const error = instance?.getError?.()
          if (error || !features?.length) {
            featuresFiltered.push([{ contained: [], overlapping: [], error }])
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
                ? ([{ contained: features, overlapping: [] }] as FilteredPolygons[])
                : await filterCellsByPolygon({
                    layersCells: [features],
                    polygon: area.geometry!,
                    mode,
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
      } catch (error) {
        console.error('Error processing features:', error)
        setReportState((prev) => ({
          ...prev,
          ...initialReportState,
        }))
      }
    }
    if (isLoaded && isAreaInViewport && reportStateCacheHash.current !== '') {
      processFeatures()
    }
  }, [
    area?.geometry,
    area?.id,
    isLoaded,
    instances,
    isAreaInViewport,
    filterCellsByPolygon,
    setReportState,
  ])

  useEffect(() => {
    const processFeatureStats = () => {
      const stats = getTimeseriesStats({
        instances,
        featuresFiltered: reportState.featuresFiltered!,
        start,
        end,
      })
      setReportState((prev) => ({ ...prev, stats }))
    }

    if (
      isLoaded &&
      isAreaInViewport &&
      reportState.featuresFiltered &&
      reportStateCacheHash.current !== ''
    ) {
      processFeatureStats()
    }
  }, [
    isLoaded,
    instances,
    isAreaInViewport,
    reportState?.featuresFiltered,
    setReportState,
    start,
    end,
  ])

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
