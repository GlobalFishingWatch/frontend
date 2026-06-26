import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { MultiPolygon, Polygon } from 'geojson'
import { useAtomValue } from 'jotai'

import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { getLayersStateHashAtom, useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
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
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useMapBoundsLive, useMapFitBounds } from 'features/map/map-bounds.hooks'
import { getContextValue } from 'features/map/popups/map-popups.utils'
import { getSimplificationByDataview } from 'features/reports/report-area/area-reports.hooks'
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
  const has = { activity: hasActivity, detections: hasDetections }
  const other: TooltipCategory = preferredCategory === 'activity' ? 'detections' : 'activity'
  const category: TooltipCategory = has[preferredCategory] ? preferredCategory : other
  return {
    category,
    setPreferredCategory,
    canSwitch: hasActivity && hasDetections,
  }
}

function isLonRangeContained(westV: number, eastV: number, westA: number, eastA: number): boolean {
  let vWidth = eastV - westV
  if (vWidth <= 0) vWidth += 360
  if (vWidth >= 359.95) return true // whole world visible
  let aWidth = eastA - westA
  if (aWidth < 0) aWidth += 360
  const offset = (((westA - westV) % 360) + 360) % 360
  return aWidth <= vWidth && offset + aWidth <= vWidth + 1e-6
}

function useAreaDetail(
  feature: ContextPickingObject | UserLayerPickingObject,
  { fetch = false }: { fetch?: boolean } = {}
) {
  const dispatch = useAppDispatch()
  const datasetId = feature.datasetId
  const areaId = String(getAreaIdFromFeature(feature))
  const areaName = getContextValue(feature) || ''
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const dataview = dataviews?.find((d) => d.id === feature.dataviewId)
  const simplify = dataview ? String(getSimplificationByDataview(dataview)) : undefined
  const areaDetail = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const areaStatus = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))

  useEffect(() => {
    if (fetch && datasetId && areaId && !areaDetail && areaStatus === undefined) {
      dispatch(fetchAreaDetailThunk({ datasetId, areaId, areaName, simplify }))
    }
  }, [fetch, dispatch, datasetId, areaId, areaName, simplify, areaDetail, areaStatus])

  return { datasetId, areaId, areaName, simplify, areaDetail, areaStatus }
}

export function useAreaInViewport(
  feature: ContextPickingObject | UserLayerPickingObject,
  enabled = true
): boolean | undefined {
  const { areaDetail } = useAreaDetail(feature, { fetch: enabled })
  const { bounds } = useMapBoundsLive()

  if (!enabled) return undefined
  const b = areaDetail?.bounds
  if (!b || !bounds) return undefined
  const latContained = b[1] >= bounds.south && b[3] <= bounds.north
  return latContained && isLonRangeContained(bounds.west, bounds.east, b[0], b[2])
}

export function useFitAreaBounds(feature: ContextPickingObject | UserLayerPickingObject) {
  const fitBounds = useMapFitBounds()
  const dispatch = useAppDispatch()
  const { datasetId, areaId, areaName, simplify, areaDetail, areaStatus } = useAreaDetail(feature)

  const onClick = useCallback(async () => {
    let bounds = areaDetail?.bounds
    if (!bounds) {
      const area = await dispatch(
        fetchAreaDetailThunk({ datasetId, areaId, areaName, simplify })
      ).unwrap()
      bounds = area?.bounds
    }
    if (bounds) {
      fitBounds(bounds, { fitZoom: true, flyTo: true })
    }
  }, [areaDetail, dispatch, datasetId, areaId, areaName, simplify, fitBounds])

  return { onClick, loading: areaStatus === AsyncReducerStatus.Loading }
}

export type AreaTooltipTimeseries = {
  loading: boolean
  timeseries: ReportGraphProps | undefined
  start: string
  end: string
  areaInViewport: boolean | undefined
}

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

  const { datasetId, areaId, areaDetail, areaStatus } = useAreaDetail(feature)
  const geometry = (areaDetail?.geometry ?? feature.geometry) as Polygon | MultiPolygon | undefined
  const areaInViewport = useAreaInViewport(feature)

  const [state, setState] = useState<{
    loading: boolean
    timeseries: ReportGraphProps | undefined
  }>({ loading: true, timeseries: undefined })

  const instances = useMemo(() => reportLayers.map((l) => l.instance), [reportLayers])
  const isLoaded =
    reportLayers.length > 0 &&
    reportLayers.every(({ instance, loaded }) => instance.isLoaded && loaded)

  const layerIds = useMemo(() => reportLayers.map((l) => l.id), [reportLayers])
  const layerIdsHash = layerIds.join(',')
  const layersStateHashAtom = useMemo(
    () => getLayersStateHashAtom(layerIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layerIdsHash]
  )
  const layersStateHash = useAtomValue(layersStateHashAtom)

  const computeHash = `${areaId}|${datasetId}|${layerIdsHash}|${isLoaded}|${layersStateHash}|${!!geometry}|${areaInViewport}`

  useEffect(() => {
    if (!geometry || !instances.length || !isLoaded || !areaInViewport) {
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

  const computable = instances.length > 0 && areaInViewport === true
  const loading = computable
    ? state.loading || areaStatus === AsyncReducerStatus.Loading
    : instances.length > 0 && areaInViewport === undefined
  return {
    start,
    end,
    areaInViewport,
    loading,
    timeseries: computable ? state.timeseries : undefined,
  }
}
