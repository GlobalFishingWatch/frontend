import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import memoizeOne from 'memoize-one'
import { useSelector } from 'react-redux'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { mean, min, max } from 'simple-statistics'
import { DateTime } from 'luxon'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { DeckLayerAtom, useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import {
  FourwingsLayer,
  FourwingsLayerProps,
  getIntervalFrames,
  HEATMAP_STATIC_PROPERTY_ID,
  sliceCellValues,
} from '@globalfishingwatch/deck-layers'
import {
  FourwingsFeature,
  FourwingsInterval,
  FourwingsStaticFeature,
} from '@globalfishingwatch/deck-loaders'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { FilteredPolygons } from 'features/reports/shared/activity/reports-activity-geo.utils'
import {
  FeaturesToTimeseriesParams,
  featuresToTimeseries,
  filterTimeseriesByTimerange,
} from 'features/reports/shared/activity/reports-activity-timeseries.utils'
import { useReportAreaInViewport } from 'features/reports/areas/area-reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
} from 'features/reports/areas/area-reports.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { Area, AreaGeometry } from 'features/areas/areas.slice'
import { useFilterCellsByPolygonWorker } from 'features/reports/shared/activity/reports-activity-geo.utils.workers.hooks'
import { TimeRange } from 'features/timebar/timebar.slice'
import { ReportActivityGraph, ReportCategory } from 'features/reports/areas/area-reports.types'
import {
  selectReportActivityGraph,
  selectReportTimeComparison,
} from 'features/reports/areas/area-reports.config.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/areas/area-reports.config'
import { selectVGRActivitySubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'

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
  return timeseries && timeseries.length > 0
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
  const reportLayerInstanceLoaded = useReportInstances()?.every((layer) => layer.loaded)
  const areaInViewport = useReportAreaInViewport()
  return areaInViewport && !reportLayerInstanceLoaded
}

const useReportTimeseries = (reportLayers: DeckLayerAtom<FourwingsLayer>[]) => {
  const [timeseries, setTimeseries] = useAtom(mapTimeseriesAtom)
  const setTimeseriesStats = useSetAtom(mapTimeseriesStatsAtom)
  const [featuresFiltered, setFeaturesFiltered] = useState<FilteredPolygons[][]>([])
  const featuresFilteredDirtyRef = useRef<boolean>(true)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()
  const area = useSelector(selectReportArea)
  const areaInViewport = useReportAreaInViewport()
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportCategory = useSelector(selectReportCategory)
  const vGRActivitySubsection = useSelector(selectVGRActivitySubsection)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const dataviews = useSelector(selectActiveReportDataviews)
  const timerange = useSelector(selectTimeRange)

  const instances = reportLayers.map((l) => l.instance)
  const layersLoaded = instances?.length ? instances?.every((l) => l.isLoaded) : false

  const timeComparisonHash = timeComparison ? JSON.stringify(timeComparison) : undefined
  const instancesChunkHash = instances
    ?.map((instance) => JSON.stringify(instance.getChunk()))
    .join(',')
  const timerangeHash = timerange ? JSON.stringify(timerange) : ''
  const reportGraphMode = getReportGraphMode(reportGraph)

  // We need to re calculate the timeseries and the filteredFeatures when any of this params changes
  useEffect(() => {
    setTimeseries([])
    setFeaturesFiltered([])
    featuresFilteredDirtyRef.current = true
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

  const updateFeaturesFiltered = useCallback(
    async (instances: FourwingsLayer[], area: Area<AreaGeometry>, mode?: 'point' | 'cell') => {
      setFeaturesFiltered([])
      for (const instance of instances) {
        const features = instance.getData() as FourwingsFeature[]
        const filteredInstanceFeatures =
          area.id === ENTIRE_WORLD_REPORT_AREA_ID
            ? ([{ contained: features, overlapping: [] }] as FilteredPolygons[])
            : await filterCellsByPolygon({
                layersCells: [features],
                polygon: area.geometry!,
                mode,
              })
        setFeaturesFiltered((prev) => [...prev, filteredInstanceFeatures])
      }
    },
    [filterCellsByPolygon]
  )

  useEffect(() => {
    if (
      area?.geometry &&
      areaInViewport &&
      layersLoaded &&
      featuresFilteredDirtyRef.current &&
      instances.length
    ) {
      if (instances.some((l) => l.getData().length)) {
        updateFeaturesFiltered(instances, area, reportCategory === 'environment' ? 'point' : 'cell')
        featuresFilteredDirtyRef.current = false
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, reportCategory, areaInViewport, layersLoaded, reportBufferHash])

  const computeTimeseries = useCallback(
    (
      instances: FourwingsLayer[],
      filteredFeatures: FilteredPolygons[][],
      graphMode: ReportGraphMode
    ) => {
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
        const features = filteredFeatures[index]
        if (features && (!timeseries?.[index] || timeseries?.[index].mode === 'loading')) {
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
            graphMode,
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
      setTimeseries(newTimeseries)
    },
    [setTimeseries, timeComparison, timeseries]
  )

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
      setTimeseriesStats(timeseriesStats)
    },
    [dataviews, setTimeseriesStats]
  )

  useEffect(() => {
    if (layersLoaded && featuresFiltered?.length && areaInViewport) {
      computeTimeseries(instances, featuresFiltered, reportGraphMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layersLoaded,
    featuresFiltered,
    areaInViewport,
    reportCategory,
    reportGraphMode,
    timeComparisonHash,
    instancesChunkHash,
  ])

  useEffect(() => {
    if (
      layersLoaded &&
      featuresFiltered?.length &&
      areaInViewport &&
      timerange &&
      reportCategory === 'environment'
    ) {
      computeTimeseriesStats(instances, featuresFiltered, timerange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    layersLoaded,
    featuresFiltered,
    areaInViewport,
    reportCategory,
    reportGraphMode,
    timeComparisonHash,
    instancesChunkHash,
    timerangeHash,
  ])

  return timeseries
}

// Run in ReportActivityGraph.tsx and ReportEnvironmnet.tsx
export const useComputeReportTimeSeries = () => {
  const reportLayers = useReportInstances()
  useReportTimeseries(reportLayers)
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const timeseries = useAtomValue(mapTimeseriesAtom)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const layersTimeseriesFiltered = useMemo(() => {
    if (!timeseries) {
      return []
    }
    if (showTimeComparison) {
      return timeseries
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return memoizedFilterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}