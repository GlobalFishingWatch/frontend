import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { MultiPolygon, Polygon } from 'geojson'

import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextPickingObject,
  FourwingsLayer,
  UserLayerPickingObject,
} from '@globalfishingwatch/deck-layers'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useMapBoundsLive } from 'features/map/map-bounds.hooks'
import { getContextValue } from 'features/map/popups/map-popups.utils'
import { useFilterCellsByPolygonWorker } from 'features/reports/reports-geo.utils.workers.hooks'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { getFeaturesFilteredByArea } from 'features/reports/reports-timeseries.hooks'
import { getTimeseries } from 'features/reports/reports-timeseries.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

import { getAreaIdFromFeature } from './ContextLayers.hooks'

export type TooltipCategory = 'activity' | 'detections'

export function useAreaTooltipSparklineCategory() {
  const hasActivity = (useSelector(selectActiveActivityDataviews)?.length ?? 0) > 0
  const hasDetections = (useSelector(selectActiveDetectionsDataviews)?.length ?? 0) > 0
  const [preferredCategory, setPreferredCategory] = useState<TooltipCategory>('activity')
  const category: TooltipCategory =
    preferredCategory === 'activity'
      ? hasActivity
        ? 'activity'
        : 'detections'
      : hasDetections
        ? 'detections'
        : 'activity'
  return {
    category,
    setPreferredCategory,
    canSwitch: hasActivity && hasDetections,
    hasAny: hasActivity || hasDetections,
  }
}

// Whether the clicked area's bbox is fully contained in the current map viewport.
// The sparkline reads features from the rendered viewport, so it's only accurate when the
// whole area fits on screen. Returns undefined while the area geometry is still loading.
// Pass enabled=false to skip the area-detail fetch (e.g. when no sparkline will be shown).
// ponytail: simple bbox containment, ignores antimeridian wrap.
export function useAreaInViewport(
  feature: ContextPickingObject | UserLayerPickingObject,
  enabled = true
): boolean | undefined {
  const dispatch = useAppDispatch()
  const datasetId = feature.datasetId
  const areaId = String(getAreaIdFromFeature(feature))
  const areaName = getContextValue(feature) || ''
  const areaDetail = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const areaStatus = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const { bounds } = useMapBoundsLive()

  useEffect(() => {
    if (enabled && datasetId && areaId && !areaDetail && areaStatus === undefined) {
      dispatch(fetchAreaDetailThunk({ datasetId, areaId, areaName }))
    }
  }, [enabled, dispatch, datasetId, areaId, areaName, areaDetail, areaStatus])

  if (!enabled) return undefined
  const b = areaDetail?.bounds
  if (!b || !bounds) return undefined
  return b[0] >= bounds.west && b[2] <= bounds.east && b[1] >= bounds.south && b[3] <= bounds.north
}

export type AreaTooltipTimeseries = {
  loading: boolean
  timeseries: ReportGraphProps | undefined
  start: string
  end: string
  // undefined while the area geometry is still loading
  areaInViewport: boolean | undefined
}

// Computes the activity/detections timeseries for a clicked area into local state,
// reusing the report's getFeaturesFilteredByArea + getTimeseries. Safe to keep separate
// from the report's reportStateAtom because this sparkline is never shown on the /report
// route, so the two never run at once.
export function useAreaTooltipTimeseries(
  feature: ContextPickingObject | UserLayerPickingObject,
  category: TooltipCategory
): AreaTooltipTimeseries {
  const { start, end } = useSelector(selectTimeRange)
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const detectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const dataviews = category === 'detections' ? detectionsDataviews : activityDataviews
  const ids = useMemo(
    () => (dataviews?.length ? [getMergedDataviewId(dataviews)] : ['']),
    [dataviews]
  )
  const reportLayers = useGetDeckLayers<FourwingsLayer>(ids)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()

  const datasetId = feature.datasetId
  const areaId = String(getAreaIdFromFeature(feature))

  const areaDetail = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const areaStatus = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const geometry = (areaDetail?.geometry ?? (feature as any).geometry) as
    | Polygon
    | MultiPolygon
    | undefined
  const areaInViewport = useAreaInViewport(feature)

  const [state, setState] = useState<{
    loading: boolean
    timeseries: ReportGraphProps | undefined
  }>({ loading: true, timeseries: undefined })

  const instances = useMemo(() => reportLayers.map((l) => l.instance), [reportLayers])
  const isLoaded =
    reportLayers.length > 0 &&
    reportLayers.every(({ instance, loaded }) => instance.isLoaded && loaded)
  const computeHash = `${areaId}|${datasetId}|${instances.map((i) => i.id).join(',')}|${isLoaded}|${!!geometry}|${areaInViewport}`
  const lastHash = useRef('')

  useEffect(() => {
    if (
      !geometry ||
      !instances.length ||
      !isLoaded ||
      !areaInViewport ||
      computeHash === lastHash.current
    ) {
      return
    }
    let cancelled = false
    const run = async () => {
      setState((prev) => ({ ...prev, loading: true }))
      try {
        const featuresFiltered = await getFeaturesFilteredByArea({
          instances,
          areaId,
          areaGeometry: geometry,
          filterCellsByPolygon,
        })
        if (cancelled || featuresFiltered === null) {
          return
        }
        const timeseries = getTimeseries({ featuresFiltered, instances })
        if (!cancelled) {
          lastHash.current = computeHash
          setState({ loading: false, timeseries: timeseries?.[0] })
        }
      } catch (e) {
        console.error('Error computing area tooltip timeseries:', e)
        if (!cancelled) setState({ loading: false, timeseries: undefined })
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computeHash])

  // No layers to compute from: nothing to load, nothing to show
  if (!instances.length) {
    return { loading: false, timeseries: undefined, start, end, areaInViewport }
  }
  // Still resolving the area geometry, or area doesn't fit the viewport: don't show a graph
  if (areaInViewport === undefined) {
    return { loading: true, timeseries: undefined, start, end, areaInViewport }
  }
  if (areaInViewport === false) {
    return { loading: false, timeseries: undefined, start, end, areaInViewport }
  }
  const loading = state.loading || areaStatus === AsyncReducerStatus.Loading
  return { loading, timeseries: state.timeseries, start, end, areaInViewport }
}
