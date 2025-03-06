import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'
import memoizeOne from 'memoize-one'
import { max, mean, min } from 'simple-statistics'

import { getUTCDateTime } from '@globalfishingwatch/data-transforms'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer, FourwingsLayerProps } from '@globalfishingwatch/deck-layers'
import {
  getIntervalFrames,
  HEATMAP_STATIC_PROPERTY_ID,
  sliceCellValues,
} from '@globalfishingwatch/deck-layers'
import {
  type FourwingsFeature,
  type FourwingsInterval,
  type FourwingsStaticFeature,
  getFourwingsInterval,
} from '@globalfishingwatch/deck-loaders'

import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import { useReportAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
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
import type { FilteredPolygons } from 'features/reports/tabs/activity/reports-activity-geo.utils'
import { useFilterCellsByPolygonWorker } from 'features/reports/tabs/activity/reports-activity-geo.utils.workers.hooks'
import type { FeaturesToTimeseriesParams } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
} from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import type { TimeRange } from 'features/timebar/timebar.slice'

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

export type ReportGraphStats = Record<
  string,
  {
    min: number
    max: number
    mean: number
  }
>

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

const mapTimeseriesAtom = atom([] as ReportGraphProps[] | undefined)

if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapTimeseries'
}

export function useSetTimeseries() {
  return useSetAtom(mapTimeseriesAtom)
}

export function useTimeseriesStats() {
  return useAtomValue(reportStateAtom)?.stats
}

export const useReportInstances = () => {
  const currentCategory = useSelector(selectReportCategory)
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  let ids = ['']
  if (currentCategoryDataviews?.length > 0) {
    if (currentCategory === ReportCategory.Environment) {
      ids = currentCategoryDataviews.map((dataview) => dataview.id)
    } else {
      ids = [getMergedDataviewId(currentCategoryDataviews)]
    }
  }
  const reportLayerInstances = useGetDeckLayers<FourwingsLayer>(ids)
  return reportLayerInstances
}

export const useReportFeaturesLoading = () => {
  return useAtomValue(reportStateAtom)?.isLoading
}

type GetTimeseriesParams = {
  featuresFiltered: FilteredPolygons[][]
  instances: FourwingsLayer[]
}
const getTimeseries = ({ featuresFiltered, instances }: GetTimeseriesParams) => {
  const timeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    const features = featuresFiltered?.[index]
    if (instance.props.static || !features) {
      // need to add empty timeseries because they are then used by their index
      timeseries.push({
        timeseries: [],
        interval: 'MONTH',
        sublayers: [],
      })
      return
    }
    const chunk = instance.getChunk()
    const sublayers = instance.getFourwingsLayers()
    const props = instance.props as FourwingsLayerProps
    const params: FeaturesToTimeseriesParams = {
      staticHeatmap: props.static,
      interval: chunk.interval,
      start: props.comparisonMode === 'timeCompare' ? props.startTime : chunk.bufferedStart,
      end: props.comparisonMode === 'timeCompare' ? props.endTime : chunk.bufferedEnd,
      compareStart: props.compareStart,
      compareEnd: props.compareEnd,
      aggregationOperation: props.aggregationOperation,
      minVisibleValue: props.minVisibleValue,
      maxVisibleValue: props.maxVisibleValue,
      sublayers,
    }
    timeseries.push(featuresToTimeseries(features, params)[0])
  })
  return timeseries
}

const getTimeseriesStats = ({
  featuresFiltered,
  instances,
  start,
  end,
}: GetTimeseriesParams & TimeRange) => {
  const timeseriesStats = {} as ReportGraphStats
  instances.forEach((instance, index) => {
    const features = featuresFiltered[index]
    if (features?.[0]?.contained?.length > 0) {
      if (instance.props.static) {
        const allValues = (features[0].contained as FourwingsStaticFeature[]).flatMap((f) => {
          return f.properties?.[HEATMAP_STATIC_PROPERTY_ID] || []
        })
        if (allValues.length > 0) {
          timeseriesStats[instance.id] = {
            min: min(allValues),
            max: max(allValues),
            mean: mean(allValues),
          }
        }
        return
      }
      const chunk = instance.getChunk()
      const { startFrame, endFrame } = getIntervalFrames({
        startTime: DateTime.fromISO(start).toUTC().toMillis(),
        endTime: DateTime.fromISO(end).toUTC().toMillis(),
        availableIntervals: [chunk.interval],
        bufferedStart: chunk.bufferedStart,
      })
      const allValues = (features[0].contained as FourwingsFeature[]).flatMap((f) => {
        const values = sliceCellValues({
          values: f.properties.values[0],
          startFrame,
          endFrame,
          startOffset: f.properties.startOffsets[0],
        })
        return values || []
      })
      if (allValues.length > 0) {
        timeseriesStats[instance.id] = {
          min: min(allValues),
          max: max(allValues),
          mean: mean(allValues),
        }
      }
    }
  })
  return timeseriesStats
}

const useReportTimeseries = (reportLayers: DeckLayerAtom<FourwingsLayer>[]) => {
  const [reportState, setReportState] = useAtom(reportStateAtom)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const isAreaInViewport = useReportAreaInViewport()
  const { start, end } = useTimerangeConnect()
  const interval = getFourwingsInterval(start, end)

  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const timeComparisonHash = useSelector(selectTimeComparisonHash)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const reportGraphMode = getReportGraphMode(reportGraph)
  const reportStateCacheHash = useRef('')

  const instancesChunkHash = reportLayers
    ?.flatMap(({ instance }) => {
      if (!instance?.getChunk) return []
      const { bufferedStart, bufferedEnd, interval } = instance.getChunk()
      return `${instance.id}-${interval}-${bufferedStart}-${bufferedEnd}`
    })
    .join(',')

  const instances = useMemo(
    () => reportLayers.map((l) => l.instance),
    // We need to update the instances when the instancesChunkHash or the reportBufferHash changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reportLayers, instancesChunkHash, reportBufferHash]
  )

  const isLoaded = instances?.length ? instances.every((i) => i.isLoaded) : false

  useLayoutEffect(() => {
    reportStateCacheHash.current = ''
    setReportState((prev) => ({
      ...prev,
      ...initialReportState,
      isLoading: reportCategory && reportCategory !== 'events',
    }))
    // We want to clean the reportState when any of these params changes to avoid using old data until it loads
  }, [
    area?.id,
    interval,
    reportCategory,
    reportSubCategory,
    reportGraphMode,
    reportBufferHash,
    instancesChunkHash,
    timeComparisonHash,
    setReportState,
  ])

  useEffect(() => {
    const newHash = area?.id
      ? `${area?.id}|${reportCategory}|${reportSubCategory}|${reportGraphMode}|${timeComparisonHash}|${instancesChunkHash}|${isLoaded}|${reportBufferHash}`
      : ''
    reportStateCacheHash.current = newHash
  }, [
    area?.id,
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
          const features = instance?.getData?.() as FourwingsFeature[]
          const error = instance?.getError?.()
          if (error || !features.length) {
            featuresFiltered.push([{ contained: [], overlapping: [], error }])
          } else {
            const filteredInstanceFeatures =
              area.id === ENTIRE_WORLD_REPORT_AREA_ID
                ? ([{ contained: features, overlapping: [] }] as FilteredPolygons[])
                : await filterCellsByPolygon({
                    layersCells: [features],
                    polygon: area.geometry!,
                    mode: instance.props.category === 'environment' ? 'point' : 'cell',
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

// Run in ReportActivityGraph.tsx and ReportEnvironmnet.tsx
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
