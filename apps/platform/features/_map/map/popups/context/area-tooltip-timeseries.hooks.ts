import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { MultiPolygon, Polygon } from 'geojson'
import { useAtomValue } from 'jotai'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import {
  getLayersStateHashAtom,
  useGetDeckLayer,
  useGetDeckLayers,
} from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextPickingObject,
  FourwingsLayer,
  UserLayerPickingObject,
} from '@globalfishingwatch/deck-layers'
import { UserTracksLayer } from '@globalfishingwatch/deck-layers'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
} from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { selectDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { selectActiveHeatmapEnvironmentalDataviewsWithoutStatic } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { useMapBoundsLive, useMapFitBounds } from 'features/_map/map/map-bounds.hooks'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { getSimplificationByDataview } from 'features/_reports/report-area/area-reports.hooks'
import { useFilterCellsByPolygonWorker } from 'features/_reports/reports-geo.utils.workers.hooks'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import { getFeaturesFilteredByArea } from 'features/_reports/reports-timeseries.hooks'
import { getTimeseries } from 'features/_reports/reports-timeseries.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/data/areas/areas.slice'
import { selectIsAnyReportLocation } from 'router/routes.selectors'
import type { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import { getContextValue } from '../map-popups.utils'

import { getAreaIdFromFeature } from './ContextLayers.hooks'

export type TooltipCategory = 'activity' | 'detections' | 'environment'

export type TooltipSparklineOption = {
  /** 'activity' | 'detections' for merged heatmaps, dataview id for environmental ones */
  id: string
  label: string
  category: TooltipCategory
}

export function useAreaTooltipSparklineCategory() {
  const { t } = useTranslation()
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const detectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const environmentalDataviews = useSelector(selectActiveHeatmapEnvironmentalDataviewsWithoutStatic)
  const [preferredId, setPreferredId] = useState<string>('activity')

  const options = useMemo(() => {
    const options: TooltipSparklineOption[] = []
    if (activityDataviews?.length) {
      options.push({ id: 'activity', label: t((t) => t.common.activity), category: 'activity' })
    }
    if (detectionsDataviews?.length) {
      options.push({
        id: 'detections',
        label: t((t) => t.common.detections),
        category: 'detections',
      })
    }
    environmentalDataviews?.forEach((dataview) => {
      const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
      options.push({
        id: dataview.id,
        label: dataset ? getDatasetLabel(dataset) : (dataview.name ?? dataview.id),
        category: 'environment',
      })
    })
    return options
  }, [activityDataviews, detectionsDataviews, environmentalDataviews, t])

  return {
    option: options.find(({ id }) => id === preferredId) ?? options[0],
    options,
    setPreferredCategory: setPreferredId,
    canSwitchCategory: options.length > 1,
    hasSparklineCategories: options.length > 0,
  }
}

/**
 * Which area row of a context popup is expanded. `PopupByCategory` keys the context sections by
 * category, so they are not remounted between two clicks — the expanded row is derived from the
 * current feature ids instead of being seeded once, and defaults to open on a single-area click.
 */
export function useAreaRowExpansion(ids: string[], showFeaturesDetails: boolean) {
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const { hasSparklineCategories } = useAreaTooltipSparklineCategory()
  const key = ids.join(',')
  const [expanded, setExpanded] = useState<{ key: string; id: string | null }>({
    key: '',
    id: null,
  })
  const expandedId = expanded.key === key ? expanded.id : ids.length === 1 ? ids[0] : null
  const toggleExpanded = useCallback(
    (id: string) => setExpanded({ key, id: expandedId === id ? null : id }),
    [key, expandedId]
  )
  return {
    canExpand: showFeaturesDetails && !isAnyReportLocation && hasSparklineCategories,
    expandedId,
    toggleExpanded,
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
  const { datasetId, areaId, areaDetail } = useAreaDetail(feature, { fetch: enabled })
  const { bounds } = useMapBoundsLive()
  const key = `${datasetId}|${areaId}`

  const b = areaDetail?.bounds
  const contained =
    b && bounds
      ? b[1] >= bounds.south &&
        b[3] <= bounds.north &&
        isLonRangeContained(bounds.west, bounds.east, b[0], b[2])
      : undefined

  // the latch keeps a computed sparkline visible while panning away, but it only holds for as long
  // as the row stays open — on re-open the area has to be contained again or the cells it needs
  // are no longer loaded and the chart would render empty
  const [latchedKey, setLatchedKey] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (!enabled) {
      setLatchedKey(undefined)
    } else if (contained) {
      setLatchedKey(key)
    }
  }, [enabled, contained, key])

  if (!enabled) {
    return undefined
  }
  return latchedKey === key ? true : contained
}

export function useFitAreaBounds(feature: ContextPickingObject | UserLayerPickingObject) {
  const fitBounds = useMapFitBounds()
  const dispatch = useAppDispatch()
  const { start, end } = useSelector(selectTimeRange)
  const trackLayer = useGetDeckLayer<UserTracksLayer>(feature.layerId)?.instance
  const { datasetId, areaId, areaName, simplify, areaDetail, areaStatus } = useAreaDetail(feature)

  const onClick = useCallback(async () => {
    if (trackLayer instanceof UserTracksLayer) {
      const bbox = trackLayer.getBbox({ startDate: start, endDate: end }) || trackLayer.getBbox()
      if (bbox) {
        fitBounds(bbox as Bbox, { padding: 60, fitZoom: true, flyTo: true })
      }
      return
    }
    let bounds: Bbox | undefined =
      areaDetail?.bounds || ((feature.properties?.bbox as string)?.split(',').map(Number) as Bbox)
    if (!bounds) {
      const area = await dispatch(
        fetchAreaDetailThunk({ datasetId, areaId, areaName, simplify })
      ).unwrap()
      bounds = area?.bounds
    }
    if (bounds) {
      fitBounds(bounds, { fitZoom: true, flyTo: true })
    }
  }, [
    trackLayer,
    areaDetail?.bounds,
    feature.properties?.bbox,
    start,
    end,
    fitBounds,
    dispatch,
    datasetId,
    areaId,
    areaName,
    simplify,
  ])

  return { onClick, loading: areaStatus === AsyncReducerStatus.Loading }
}

export type AreaTooltipTimeseries = {
  loading: boolean
  timeseries: ReportGraphProps | undefined
  start: string
  end: string
}

export function useAreaTooltipTimeseries(
  feature: ContextPickingObject | UserLayerPickingObject,
  option: TooltipSparklineOption | undefined
): AreaTooltipTimeseries {
  const { start, end } = useSelector(selectTimeRange)
  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const detectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const ids = useMemo(() => {
    if (option?.category === 'environment') {
      return [option.id]
    }
    const dataviews = option?.category === 'detections' ? detectionsDataviews : activityDataviews
    return dataviews?.length ? [getMergedDataviewId(dataviews)] : ['']
  }, [option, activityDataviews, detectionsDataviews])
  const reportLayers = useGetDeckLayers<FourwingsLayer>(ids)
  const filterCellsByPolygon = useFilterCellsByPolygonWorker()

  // callers only mount this once useAreaInViewport says the area is contained, so no second check
  // here — a duplicate latch would disagree with the row's and render an empty chart
  const { datasetId, areaId, areaDetail, areaStatus } = useAreaDetail(feature)
  const geometry = (areaDetail?.geometry ?? feature.geometry) as Polygon | MultiPolygon | undefined

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

  const areaHash = `${areaId}|${datasetId}|${layerIdsHash}|${start}|${end}`
  const computedAreaRef = useRef<string | undefined>(undefined)
  const computeHash = `${areaHash}|${isLoaded}|${layersStateHash}|${!!geometry}`

  useEffect(() => {
    if (!geometry || !instances.length || !isLoaded) {
      return
    }
    if (computedAreaRef.current === areaHash) {
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
          computedAreaRef.current = areaHash
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

  const computable = instances.length > 0
  return {
    start,
    end,
    loading: computable && (state.loading || areaStatus === AsyncReducerStatus.Loading),
    timeseries: computable ? state.timeseries : undefined,
  }
}
