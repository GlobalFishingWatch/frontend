import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
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

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import type { Area, AreaGeometry } from 'features/areas/areas.slice'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import { useReportAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
} from 'features/reports/report-area/area-reports.selectors'
import {
  selectReportActivityGraph,
  selectReportTimeComparison,
} from 'features/reports/reports.config.selectors'
import {
  selectReportActivitySubCategory,
  selectReportCategory,
} from 'features/reports/reports.selectors'
import type {
  ReportActivityGraph,
  ReportActivityTimeComparison,
} from 'features/reports/reports.types'
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
  // stats: ReportGraphStats
  isLoading: boolean
  timeseries: ReportGraphProps[] | undefined
  featuresFiltered: FilteredPolygons[][] | undefined
}

const initialReportState: ReportState = {
  // stats: {},
  isLoading: false,
  timeseries: undefined,
  featuresFiltered: undefined,
}

const reportStateAtom = atom(initialReportState)

const mapTimeseriesAtom = atom([] as ReportGraphProps[] | undefined)
const mapTimeseriesStatsAtom = atom({} as ReportGraphStats)

if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapTimeseries'
}
export function useSetTimeseries() {
  return useSetAtom(mapTimeseriesAtom)
}

export function useHasReportTimeseries() {
  const timeseries = useAtomValue(mapTimeseriesAtom)
  return timeseries !== undefined
}

export function useTimeseriesStats() {
  return useAtomValue(mapTimeseriesStatsAtom)
}

const useReportInstances = () => {
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
  const { isLoading } = useAtomValue(reportStateAtom)
  return isLoading
  // const reportInstances = useReportInstances()
  // const areaInViewport = useReportAreaInViewport()

  // // Using undefined to show the placeholder when the layers are not ready
  // if (!reportInstances?.length) return undefined

  // const reportLayerInstanceLoaded = reportInstances?.every((layer) => layer.loaded)
  // return areaInViewport && !reportLayerInstanceLoaded
}

type GetTimeseriesParams = {
  featuresFiltered: FilteredPolygons[][]
  instances: FourwingsLayer[]
  timeseries: ReportGraphProps[]
  timeComparison?: ReportActivityTimeComparison
  reportGraphMode: ReportGraphMode
}
const getTimeseries = ({
  featuresFiltered,
  instances,
  timeseries,
  timeComparison,
  reportGraphMode,
}: GetTimeseriesParams) => {
  const newTimeseries: ReportGraphProps[] = []
  instances.forEach((instance, index) => {
    if (instance.props.static) {
      // need to add empty timeseries because they are then used by their index
      newTimeseries.push({
        timeseries: [],
        interval: 'MONTH',
        sublayers: [],
      })
      return
    }
    const features = featuresFiltered?.[index]
    if (
      features &&
      (!timeseries || !timeseries?.[index] || timeseries?.[index].mode === 'loading')
    ) {
      const props = instance.props as FourwingsLayerProps
      const chunk = instance.getChunk()
      const sublayers = instance.getFourwingsLayers()
      const params: FeaturesToTimeseriesParams = {
        staticHeatmap: props.static,
        interval: chunk.interval,
        start: timeComparison ? props.startTime : chunk.bufferedStart,
        end: timeComparison ? props.endTime : chunk.bufferedEnd,
        compareStart: props.compareStart,
        compareEnd: props.compareEnd,
        aggregationOperation: props.aggregationOperation,
        minVisibleValue: props.minVisibleValue,
        maxVisibleValue: props.maxVisibleValue,
        sublayers,
        graphMode: reportGraphMode,
      }
      newTimeseries.push(featuresToTimeseries(features, params)[0])
    } else if (timeseries?.[index]) {
      newTimeseries.push(timeseries[index])
    } else {
      newTimeseries.push({
        timeseries: [],
        mode: 'loading',
        interval: 'MONTH',
        sublayers: [],
      } as ReportGraphProps)
    }
  })
  return newTimeseries
}

const useReportTimeseries = (reportLayers: DeckLayerAtom<FourwingsLayer>[]) => {
  const [reportState, setReportState] = useAtom(reportStateAtom)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const isAreaInViewport = useReportAreaInViewport()
  const dataviews = useSelector(selectActiveReportDataviews)
  const vGRActivitySubsection = useSelector(selectReportActivitySubCategory)
  const reportCategory = useSelector(selectReportCategory)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportBufferHash = useSelector(selectReportBufferHash)

  const instances = useMemo(() => reportLayers.map((l) => l.instance), [reportLayers])
  const reportGraphMode = getReportGraphMode(reportGraph)
  const timeComparisonHash = timeComparison ? JSON.stringify(timeComparison) : undefined
  const instancesChunkHash = instances
    ?.map((instance) => {
      const { bufferedEnd, bufferedStart, interval } = instance?.getChunk?.() || {}
      return `${instance.id}-${bufferedEnd}-${bufferedStart}-${interval}`
    })
    .join(',')

  // We need to re calculate the timeseries and the filteredFeatures when any of these params changes
  useEffect(() => {
    console.log('🚀 ~ resetting')
    setReportState({
      isLoading: true,
      timeseries: undefined,
      featuresFiltered: undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    area?.id,
    reportCategory,
    vGRActivitySubsection,
    timeComparisonHash,
    instancesChunkHash,
    reportGraphMode,
    reportBufferHash,
  ])

  const computeTimeseriesStats = useCallback(
    (
      instances: FourwingsLayer[],
      filteredFeatures: FilteredPolygons[][],
      { start, end }: TimeRange
    ) => {
      const timeseriesStats = {} as ReportGraphStats
      instances.forEach((instance, index) => {
        const features = filteredFeatures[index]
        if (features?.[0]?.contained?.length > 0) {
          const dataview = dataviews.find((dv) => dv.id === instance.id)
          if (instance.props.static) {
            const allValues = (features[0].contained as FourwingsStaticFeature[]).flatMap((f) => {
              return f.properties?.[HEATMAP_STATIC_PROPERTY_ID] || []
            })
            if (dataview?.config && allValues.length > 0) {
              timeseriesStats[dataview.id] = {
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
          if (dataview?.config && allValues.length > 0) {
            timeseriesStats[dataview.id] = {
              min: min(allValues),
              max: max(allValues),
              mean: mean(allValues),
            }
          }
        }
      })
      // TODO:timeseries embed stats into state too
      // setTimeseriesStats(timeseriesStats)
    },
    []
  )

  useEffect(() => {
    const processFeatures = async () => {
      if (!area?.geometry) {
        return
      }

      setReportState((prev) => ({ ...prev, isLoading: true }))

      try {
        const data = instances.map((l) => l?.getData?.() as FourwingsFeature[])
        if (!data.some((d) => d?.length)) {
          setReportState((prev) => ({
            ...prev,
            ...initialReportState,
          }))
          return
        }

        const filteredFeatures = await Promise.all(
          data.map((features) =>
            area.id === ENTIRE_WORLD_REPORT_AREA_ID
              ? [{ contained: features, overlapping: [] }]
              : filterCellsByPolygon({
                  layersCells: [features],
                  polygon: area.geometry!,
                  mode: reportCategory === 'environment' ? 'point' : 'cell',
                })
          )
        )

        const timeseries = getTimeseries({
          featuresFiltered: filteredFeatures,
          instances,
          // TODO:timeseries remove this if not needed
          timeseries: [],
          timeComparison,
          reportGraphMode,
        })

        setReportState((prev) => ({
          ...prev,
          isLoading: false,
          filteredFeatures,
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
    const isLoaded = instances.every((i) => i.isLoaded)
    if (isAreaInViewport && isLoaded) {
      console.log('🚀 ~ processing features')
      processFeatures()
    }
  }, [
    area,
    isAreaInViewport,
    instances,
    instancesChunkHash,
    timeComparison,
    reportGraphMode,
    setReportState,
    filterCellsByPolygon,
    reportCategory,
  ])

  return reportState
}

// Run in ReportActivityGraph.tsx and ReportEnvironmnet.tsx
export const useComputeReportTimeSeries = () => {
  const reportLayers = useReportInstances()
  useReportTimeseries(reportLayers)
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const { timeseries } = useAtomValue(reportStateAtom)
  const { start: timebarStart, end: timebarEnd } = useTimerangeConnect()
  const interval = getFourwingsInterval(timebarStart, timebarEnd)
  const startNormalisedByInterval = getUTCDateTime(timebarStart)
    .startOf(interval.toLowerCase() as DateTimeUnit)
    .toISO()
  const endNormalisedByInterval = getUTCDateTime(timebarEnd)
    .startOf(interval.toLowerCase() as DateTimeUnit)
    .toISO()
  const showTimeComparison = useSelector(selectShowTimeComparison)

  return useMemo(() => {
    if (!timeseries?.length) return []
    if (!showTimeComparison && startNormalisedByInterval && endNormalisedByInterval) {
      return memoizedFilterTimeseriesByTimerange(
        timeseries,
        startNormalisedByInterval,
        endNormalisedByInterval
      )
    }
    return timeseries
  }, [timeseries, showTimeComparison, startNormalisedByInterval, endNormalisedByInterval])
}
