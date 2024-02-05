import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import memoizeOne from 'memoize-one'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import { atom, useAtom } from 'jotai'
// import { useAtomDevtools } from 'jotai-devtools'
import { Interval } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportTimeComparison,
} from 'features/app/selectors/app.reports.selector'
import {
  DataviewFeature,
  areDataviewsFeatureLoaded,
  useMapDataviewFeatures,
  hasDataviewsFeatureError,
} from 'features/map/map-sources.hooks'
import { getUTCDateTime } from 'utils/dates'
import { filterByPolygon } from 'features/reports/reports-geo.utils'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/reports/reports-timeseries.utils'
import { useReportAreaInViewport } from 'features/reports/reports.hooks'
import {
  selectReportArea,
  selectReportBufferHash,
  selectShowTimeComparison,
} from 'features/reports/reports.selectors'
import { ReportActivityGraph } from 'types'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

export interface EvolutionGraphData {
  date: string
  min: number[]
  max: number[]
}

export interface ReportSublayerGraph {
  id: string
  legend: {
    color?: string
    unit?: string
  }
}

export type ReportGraphMode = 'evolution' | 'time'

export function getReportGraphMode(reportActivityGraph: ReportActivityGraph): ReportGraphMode {
  return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
    ? 'time'
    : 'evolution'
}

export interface ReportGraphProps {
  timeseries: (EvolutionGraphData & { mode?: ReportGraphMode })[]
  sublayers: ReportSublayerGraph[]
  interval: Interval
  mode?: ReportGraphMode
}

export const mapTimeseriesAtom = atom([] as ReportGraphProps[] | undefined)
if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapTimeseries'
}

export const mapReportFeaturesAtom = atom([] as DataviewFeature[])
if (process.env.NODE_ENV !== 'production') {
  mapTimeseriesAtom.debugLabel = 'mapReportFeatures'
}

export const hasMapTimeseriesAtom = atom((get) => {
  const timeseries = get(mapTimeseriesAtom)
  return timeseries && timeseries.length > 0
})

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export function useSetTimeseries() {
  return useAtom(mapTimeseriesAtom)[1]
}

const emptyArray: UrlDataviewInstance[] = []

export const useReportFeaturesLoading = () => {
  const areaInViewport = useReportAreaInViewport()
  const reportFeatures = useAtom(mapReportFeaturesAtom)[0]
  const reportFeaturesLoaded = areDataviewsFeatureLoaded(reportFeatures)
  return areaInViewport && !reportFeaturesLoaded
}

export const useReportFeaturesError = () => {
  const reportFeatures = useAtom(mapReportFeaturesAtom)[0]
  return hasDataviewsFeatureError(reportFeatures)
}

const useReportFeatures = () => {
  const [reportFeatures, setReportFeatures] = useAtom(mapReportFeaturesAtom)
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  const areaInViewport = useReportAreaInViewport()
  const activityFeatures = useMapDataviewFeatures(
    areaInViewport ? currentCategoryDataviews : emptyArray
  )

  useEffect(() => {
    setReportFeatures(activityFeatures)
  }, [activityFeatures, setReportFeatures])

  return reportFeatures
}

const useReportTimeseries = (reportFeatures: DataviewFeature[]) => {
  const [timeseries, setTimeseries] = useAtom(mapTimeseriesAtom)
  const area = useSelector(selectReportArea)
  const areaInViewport = useReportAreaInViewport()
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportCategory = useSelector(selectReportCategory)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const reportFeaturesLoaded = areDataviewsFeatureLoaded(reportFeatures)

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = getUTCDateTime(timeComparison.start).toMillis()
    const compareStartMillis = getUTCDateTime(timeComparison.compareStart).toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }

  const computeTimeseries = useCallback(
    (
      layersWithFeatures: DataviewFeature[],
      geometry: Polygon | MultiPolygon,
      reportGraphMode: ReportGraphMode
    ) => {
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
        compareDeltaMillis: compareDeltaMillis as number,
      })
      setTimeseries(
        timeseries.map((timeseries: any) => {
          timeseries.mode = reportGraphMode
          return timeseries
        })
      )
    },
    [showTimeComparison, compareDeltaMillis, setTimeseries]
  )

  // We need to re calculate the timeseries when area or timerange changes
  useLayoutEffect(() => {
    setTimeseries(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.id])

  const reportGraphMode = getReportGraphMode(reportGraph)
  useLayoutEffect(() => {
    if (timeseries!?.length > 0) {
      setTimeseries([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportGraphMode])
  useEffect(() => {
    if (reportFeaturesLoaded && area?.geometry && areaInViewport) {
      computeTimeseries(reportFeatures, area?.geometry as Polygon | MultiPolygon, reportGraphMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportFeaturesLoaded, area?.geometry, areaInViewport, reportCategory, reportBufferHash])

  return timeseries
}

// Run only once in Report.tsx parent component
export const useComputeReportTimeSeries = () => {
  const reportFeatures = useReportFeatures()
  useReportTimeseries(reportFeatures)
}

const memoizedFilterTimeseriesByTimerange = memoizeOne(filterTimeseriesByTimerange)
export const useReportFilteredTimeSeries = () => {
  const [timeseries] = useAtom(mapTimeseriesAtom)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const layersTimeseriesFiltered = useMemo(() => {
    if (!timeseries) {
      return []
    }
    if (showTimeComparison) {
      return removeTimeseriesPadding(timeseries)
    } else {
      if (timebarStart && timebarEnd && timeseries) {
        return memoizedFilterTimeseriesByTimerange(timeseries, timebarStart, timebarEnd)
      }
    }
  }, [timeseries, showTimeComparison, timebarStart, timebarEnd])
  return layersTimeseriesFiltered
}
