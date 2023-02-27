import { useCallback, useEffect, useMemo, useState } from 'react'
import { Polygon, MultiPolygon } from 'geojson'
import { useSelector } from 'react-redux'
import simplify from '@turf/simplify'
import bbox from '@turf/bbox'
import { atom, selector, useRecoilState } from 'recoil'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Interval } from '@globalfishingwatch/layer-composer'
import {
  selectReportActivityGraph,
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
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { getUTCDateTime } from 'utils/dates'
import { Area } from 'features/areas/areas.slice'
import { filterByPolygon } from 'features/reports/reports-geo.utils'
import {
  featuresToTimeseries,
  filterTimeseriesByTimerange,
  removeTimeseriesPadding,
} from 'features/reports/reports-timeseries.utils'
import { useAreaFitBounds } from 'features/map/map-viewport.hooks'
import { useReportAreaHighlight } from 'features/reports/reports.hooks'

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

export const useFilteredTimeSeriesByArea = (area?: Area) => {
  const [timeseries, setTimeseries] = useRecoilState(mapTimeseriesAtom)
  const [blur, setBlur] = useState(false)
  const areaGeometry = area?.geometry
  const reportType = useSelector(selectReportActivityGraph)
  // const showTimeComparison = useSelector(selectShowTimeComparison)
  const showTimeComparison = false
  const timeComparison = useSelector(selectReportTimeComparison)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const activityFeatures = useMapDataviewFeatures(temporalgridDataviews)
  const { start: timebarStart, end: timebarEnd } = useSelector(selectTimeRange)
  const sourceId = useSelector(selectReportAreaSource)
  useAreaFitBounds(area?.bounds)
  useReportAreaHighlight(area?.id, sourceId)

  const simplifiedGeometry = useMemo(() => {
    if (!areaGeometry) return null
    const simplifiedGeometry = simplify(areaGeometry, {
      tolerance: 0.1,
    })
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    simplifiedGeometry.bbox = bbox(simplifiedGeometry)
    return simplifiedGeometry
  }, [areaGeometry])

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
      setBlur(false)
    },
    [showTimeComparison, compareDeltaMillis, setTimeseries]
  )

  const reportEvolutionChange =
    reportType === 'beforeAfter' || reportType === 'periodComparison' ? 'time' : reportType

  useEffect(() => {
    setTimeseries(undefined)
    setBlur(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area?.id, reportEvolutionChange])

  useEffect(() => {
    if (timeseries) {
      setBlur(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeComparison])

  const activeSourceIdHash = activityFeatures
    .map(({ metadata }) => metadata?.timeChunks?.activeSourceId)
    .join(',')

  // Set blur when there new source data is fetched on timebar changes
  useEffect(() => {
    const hasActivityLayers = temporalgridDataviews.some(
      ({ category }) =>
        category === DataviewCategory.Activity || category === DataviewCategory.Detections
    )
    if (hasActivityLayers) {
      setBlur(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSourceIdHash])

  useEffect(() => {
    const activityFeaturesLoaded = areDataviewsFeatureLoaded(activityFeatures)
    if (activityFeaturesLoaded && simplifiedGeometry) {
      computeTimeseries(activityFeatures, simplifiedGeometry)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFeatures, simplifiedGeometry])

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
    blur,
    loading: !timeseries && !areDataviewsFeatureLoaded(activityFeatures),
    error: hasDataviewsFeatureError(activityFeatures),
    layersTimeseriesFiltered,
  }
}
