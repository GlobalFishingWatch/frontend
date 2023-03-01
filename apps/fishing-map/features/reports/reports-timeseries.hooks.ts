import { useCallback, useEffect, useMemo } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { atom, selector, useRecoilState } from 'recoil'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Interval } from '@globalfishingwatch/layer-composer'
import {
  selectReportAnalysisGraph,
  selectReportAreaSource,
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
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { filterByPolygon } from 'features/reports/reports-geo.utils'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/reports/reports-timeseries.utils'
import {
  useFitAreaInViewport,
  useReportAreaHighlight,
  useReportAreaInViewport,
} from 'features/reports/reports.hooks'
import {
  selectReportCategoryDataviews,
  selectReportAreaIds,
  selectShowTimeComparison,
} from 'features/reports/reports.selectors'

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

export interface ReportGraphProps {
  timeseries: EvolutionGraphData[]
  sublayers: ReportSublayerGraph[]
  interval: Interval
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

export const useFilteredTimeSeries = () => {
  const [timeseries, setTimeseries] = useRecoilState(mapTimeseriesAtom)
  const reportAreaIds = useSelector(selectReportAreaIds)
  const area = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const reportGraph = useSelector(selectReportAnalysisGraph)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparison = useSelector(selectReportTimeComparison)
  const currentCategoryDataviews = useSelector(selectReportCategoryDataviews)
  const activityFeatures = useMapDataviewFeatures(currentCategoryDataviews)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const areaSourceId = useSelector(selectReportAreaSource)
  const areaInViewport = useReportAreaInViewport()
  const fitAreaInViewport = useFitAreaInViewport()
  useReportAreaHighlight(area?.id, areaSourceId)

  // This ensures that the area is in viewport when then area load finishes
  useEffect(() => {
    fitAreaInViewport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area])

  const simplifiedGeometry = useMemo(() => {
    if (!area?.geometry) return null
    const simplifiedGeometry = simplify(area?.geometry, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [area?.geometry])

  let compareDeltaMillis: number | undefined = undefined
  if (showTimeComparison && timeComparison) {
    const startMillis = getUTCDateTime(timeComparison.start).toMillis()
    const compareStartMillis = getUTCDateTime(timeComparison.compareStart).toMillis()
    compareDeltaMillis = compareStartMillis - startMillis
  }

  const computeTimeseries = useCallback(
    (layersWithFeatures: DataviewFeature[], geometry: Polygon | MultiPolygon) => {
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
        compareDeltaMillis,
      })

      setTimeseries(timeseries)
    },
    [showTimeComparison, compareDeltaMillis, setTimeseries]
  )

  const reportGraphChange =
    reportGraph === 'beforeAfter' || reportGraph === 'periodComparison' ? 'time' : reportGraph
  // const reportTimerangeChange =
  //   reportGraphChange === 'time' ? `${timebarStart}-${timebarEnd}` : compareDeltaMillis

  // We need to re calculate the timeseries when area or timerange changes
  useEffect(() => {
    setTimeseries(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.id, reportGraphChange])

  const activeSourceIdHash = activityFeatures
    .map(({ metadata }) => metadata?.timeChunks?.activeSourceId)
    .join(',')

  // Re calculate timerange when there new source data is fetched on timebar changes
  useEffect(() => {
    const hasActivityLayers = currentCategoryDataviews.some(
      ({ category }) =>
        category === DataviewCategory.Activity || category === DataviewCategory.Detections
    )
    if (hasActivityLayers) {
      setTimeseries(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSourceIdHash])

  useEffect(() => {
    const activityFeaturesLoaded = areDataviewsFeatureLoaded(activityFeatures)
    if (activityFeaturesLoaded && simplifiedGeometry && areaInViewport) {
      computeTimeseries(activityFeatures, simplifiedGeometry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeatures, simplifiedGeometry, areaInViewport])

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
    loading: !timeseries && !areDataviewsFeatureLoaded(activityFeatures),
    error: hasDataviewsFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}
