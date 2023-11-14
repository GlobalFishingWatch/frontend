import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil'
import { Interval } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportTimeComparison,
  selectTimeRange,
} from 'features/app/app.selectors'
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

export const mapTimeseriesAtom = atom<ReportGraphProps[] | undefined>({
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

export function useSetTimeseries() {
  return useSetRecoilState(mapTimeseriesAtom)
}
const emptyArray: UrlDataviewInstance[] = []
export const useFilteredTimeSeries = () => {
  const [timeseries, setTimeseries] = useRecoilState(mapTimeseriesAtom)
  const area = useSelector(selectReportArea)
  const reportGraph = useSelector(selectReportActivityGraph)
  const reportCategory = useSelector(selectReportCategory)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectReportTimeComparison)
  const reportBufferHash = useSelector(selectReportBufferHash)
  const currentCategoryDataviews = useSelector(selectActiveReportDataviews)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const areaInViewport = useReportAreaInViewport()
  const activityFeatures = useMapDataviewFeatures(
    areaInViewport ? currentCategoryDataviews : emptyArray
  )

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
  const activityFeaturesLoaded = areDataviewsFeatureLoaded(activityFeatures)
  useEffect(() => {
    if (activityFeaturesLoaded && area?.geometry && areaInViewport) {
      computeTimeseries(activityFeatures, area?.geometry as Polygon | MultiPolygon, reportGraphMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeaturesLoaded, area?.geometry, areaInViewport, reportCategory, reportBufferHash])

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
    loading: areaInViewport && !activityFeaturesLoaded,
    error: hasDataviewsFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}
