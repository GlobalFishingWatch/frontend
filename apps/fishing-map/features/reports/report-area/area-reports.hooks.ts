import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetStatsByDataviewQuery } from 'queries/stats-api'

import type { Dataset, Dataview } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayers } from '@globalfishingwatch/deck-layer-composer'
import type { ContextFeature, ContextLayer } from '@globalfishingwatch/deck-layers'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'

import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { RFMO_DATAVIEW_SLUG } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { selectVGReportActivityDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.instances.selectors'
import type { FitBoundsParams } from 'features/map/map-bounds.hooks'
import { getMapCoordinatesFromBounds } from 'features/map/map-bounds.hooks'
import { useMapViewState, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import type { LastReportStorage } from 'features/reports/report-area/area-reports.config'
import {
  ENTIRE_WORLD_REPORT_AREA_BOUNDS,
  ENTIRE_WORLD_REPORT_AREA_ID,
  LAST_REPORTS_STORAGE_KEY,
} from 'features/reports/report-area/area-reports.config'
import {
  selectReportArea,
  selectReportAreaDataviews,
  selectReportAreaIds,
  selectReportAreaStatus,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
  selectReportDataviewsWithPermissions,
  selectTimeComparisonValues,
} from 'features/reports/report-area/area-reports.selectors'
import {
  selectPortReportFootprintArea,
  selectPortReportFootprintDatasetId,
} from 'features/reports/report-port/ports-report.selectors'
import {
  fetchReportVesselsThunk,
  getReportQuery,
  selectReportVesselsData,
  selectReportVesselsError,
  selectReportVesselsStatus,
} from 'features/reports/tabs/activity/reports-activity.slice'
import {
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectReportPortId,
  selectUrlTimeRange,
} from 'routes/routes.selectors'
import type { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

export type DateTimeSeries = {
  date: string
  values: number[]
}[]

const defaultIds = [] as string[]
export const useHighlightReportArea = () => {
  const areaDataviews = useSelector(selectReportAreaDataviews)
  const ids = areaDataviews?.map((d) => d.id) || defaultIds
  const areaLayers = useGetDeckLayers<ContextLayer>(ids)

  return useCallback(
    (area?: ContextFeature) => {
      areaLayers.forEach((areaLayer) => {
        if (areaLayer?.instance?.setHighlightedFeatures) {
          areaLayer.instance.setHighlightedFeatures(area ? [area] : [])
        }
      })
    },
    [areaLayers]
  )
}

const defaultParams = {} as FitBoundsParams
export function useReportAreaCenter(bounds?: Bbox, params = defaultParams) {
  return useMemo(() => {
    if (!bounds) return null
    const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(bounds, {
      padding: FIT_BOUNDS_REPORT_PADDING,
      ...params,
    })
    return {
      latitude: parseFloat(latitude.toFixed(8)),
      longitude: parseFloat(longitude.toFixed(8)),
      zoom: parseFloat(zoom.toFixed(8)),
    }
  }, [bounds, params])
}

export function useStatsBounds(dataview?: UrlDataviewInstance) {
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const {
    data: stats,
    isFetching,
    isSuccess,
  } = useGetStatsByDataviewQuery(
    {
      dataview: dataview!,
      timerange: urlTimeRange as any,
      fields: [],
    },
    {
      skip: !dataview || !urlTimeRange,
    }
  )

  const statsBbox = useMemo(
    () => stats && ([stats.minLon, stats.minLat, stats.maxLon, stats.maxLat] as Bbox),
    [stats]
  )
  const loaded = !isFetching && isSuccess
  return useMemo(
    () => ({
      loaded: loaded,
      bbox: loaded
        ? statsBbox?.some((v) => v === null || v === undefined)
          ? ENTIRE_WORLD_REPORT_AREA_BOUNDS
          : statsBbox!
        : null,
    }),
    [loaded, statsBbox]
  )
}

export function useVesselGroupActivityBounds() {
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const dataview = useSelector(selectVGReportActivityDataviews)?.[0]
  return useStatsBounds(isVesselGroupReportLocation && dataview ? dataview : undefined)
}

export function useVesselGroupBounds(dataviewId?: string) {
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const dataview = dataviews?.find((d) => d.id === dataviewId)
  return useStatsBounds(dataview)
}

export function useReportAreaBounds() {
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const { loaded: vesselGroupLoaded, bbox: vesselGroupBbox } = useVesselGroupActivityBounds()
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const { loaded: portLoaded, bbox: portBbox } = usePortsReportAreaFootprintBounds()
  const reportArea = useSelector(selectReportArea)
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  return useMemo(() => {
    if (isVesselGroupReportLocation) {
      return {
        loaded: vesselGroupLoaded,
        bbox: vesselGroupBbox,
      }
    }
    if (isPortReportLocation) {
      return {
        loaded: portLoaded,
        bbox: portBbox,
      }
    }
    return {
      loaded:
        reportArea?.id === ENTIRE_WORLD_REPORT_AREA_ID
          ? true
          : reportAreaStatus === AsyncReducerStatus.Finished,
      bbox: reportArea?.geometry?.bbox || reportArea?.bounds,
    }
  }, [
    isPortReportLocation,
    isVesselGroupReportLocation,
    portBbox,
    portLoaded,
    reportArea?.bounds,
    reportArea?.geometry?.bbox,
    reportArea?.id,
    reportAreaStatus,
    vesselGroupBbox,
    vesselGroupLoaded,
  ])
}

export function useReportAreaInViewport() {
  const viewState = useMapViewState()
  const { bbox } = useReportAreaBounds()
  const areaCenter = useReportAreaCenter(bbox as Bbox)
  return (
    viewState?.latitude === areaCenter?.latitude &&
    viewState?.longitude === areaCenter?.longitude &&
    viewState?.zoom === areaCenter?.zoom
  )
}

export function useFitAreaInViewport(params = defaultParams) {
  const setMapCoordinates = useSetMapCoordinates()
  const { bbox } = useReportAreaBounds()
  const areaCenter = useReportAreaCenter(bbox as Bbox, params)
  const areaInViewport = useReportAreaInViewport()
  return useCallback(() => {
    if (!areaInViewport && areaCenter) {
      setMapCoordinates(areaCenter)
    }
  }, [areaCenter, areaInViewport, setMapCoordinates])
}

// 0 - 20MB No simplifyTrack
// 20 - 200MG SIMPLIFY FINE_SIMPLIFY_TOLERANCE
// > 200 SIMPLIFY COARSE
const COARSE_SIMPLIFY_TOLERANCE = 0.1
const FINE_SIMPLIFY_TOLERANCE = 0.001

function getSimplificationByDataview(dataview: UrlDataviewInstance | Dataview) {
  return dataview?.slug === RFMO_DATAVIEW_SLUG ? COARSE_SIMPLIFY_TOLERANCE : FINE_SIMPLIFY_TOLERANCE
}

export function useFetchReportArea() {
  const dispatch = useAppDispatch()
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const status = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const data = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const areaDataviews = useSelector(selectReportAreaDataviews)

  useEffect(() => {
    if (datasetId && areaId && areaDataviews?.length) {
      const simplify = areaDataviews
        .map((dataview) => getSimplificationByDataview(dataview))
        .join(',')
      dispatch(
        fetchAreaDetailThunk({
          datasetId,
          areaId,
          simplify,
        })
      )
    }
  }, [areaId, datasetId, dispatch, areaDataviews])

  return useMemo(
    () => ({ status: isVesselGroupReportLocation ? AsyncReducerStatus.Finished : status, data }),
    [isVesselGroupReportLocation, status, data]
  )
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const [_, setLastReportUrl] = useLocalStorage<LastReportStorage[]>(LAST_REPORTS_STORAGE_KEY, [])
  const timerange = useSelector(selectTimeRange)
  // const timerangeSupported = getDownloadReportSupported(timerange.start, timerange.end)
  // const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)
  // const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferOperation = useSelector(selectReportBufferOperation)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  // const reportBufferHash = useSelector(selectReportBufferHash)

  const updateWorkspaceReportUrls = useCallback(
    (reportUrl: any) => {
      setLastReportUrl((lastReportUrls: LastReportStorage[]) => {
        const newReportUrl = {
          reportUrl,
          workspaceUrl: window.location.href,
        }
        if (!lastReportUrls?.length) {
          return [newReportUrl]
        }
        const reportUrlsExists = lastReportUrls.some(
          (report) => report.workspaceUrl === newReportUrl.workspaceUrl
        )
        return reportUrlsExists ? lastReportUrls : [newReportUrl, lastReportUrls[0]]
      })
    },
    [setLastReportUrl]
  )

  const dispatchFetchReport = useCallback(() => {
    const params = {
      datasets: reportDataviews.map(({ datasets = [] }) =>
        datasets?.map((d: Dataset) => d.id).join(',')
      ),
      includes: reportDataviews.flatMap(
        ({ datasets = [] }) => datasets.flatMap(({ unit }) => unit || []) || []
      ),
      filters: reportDataviews.map(({ filter }) => filter),
      vesselGroups: reportDataviews.flatMap(({ vesselGroups }) => vesselGroups || []),
      region: {
        id: areaId,
        dataset: datasetId,
      },
      dateRange: timerange,
      spatialAggregation: true,
      reportBufferUnit,
      reportBufferValue,
      reportBufferOperation,
      timeComparison: timeComparisonValues,
    }
    const query = getReportQuery(params)
    updateWorkspaceReportUrls(query)
    dispatch(fetchReportVesselsThunk(params))
  }, [
    areaId,
    datasetId,
    dispatch,
    reportBufferOperation,
    reportBufferUnit,
    reportBufferValue,
    reportDataviews,
    timeComparisonValues,
    timerange,
    updateWorkspaceReportUrls,
  ])

  return useMemo(
    () => ({ status, data, error, dispatchFetchReport }),
    [status, data, error, dispatchFetchReport]
  )
}

export function usePortsReportAreaFootprint() {
  const dispatch = useAppDispatch()
  const portReportId = useSelector(selectReportPortId)
  const portReportFootprintArea = useSelector(selectPortReportFootprintArea)
  const portReportFootprintDatasetId = useSelector(selectPortReportFootprintDatasetId)

  useEffect(() => {
    if (!portReportFootprintArea && portReportFootprintDatasetId && portReportId) {
      dispatch(
        fetchAreaDetailThunk({ datasetId: portReportFootprintDatasetId, areaId: portReportId })
      )
    }
  }, [dispatch, portReportFootprintArea, portReportFootprintDatasetId, portReportId])

  return portReportFootprintArea
}

export function usePortsReportAreaFootprintBounds() {
  const portReportFootprintArea = usePortsReportAreaFootprint()
  return useMemo(
    () => ({
      loaded: portReportFootprintArea?.status === AsyncReducerStatus.Finished,
      bbox: portReportFootprintArea?.data?.bounds,
    }),
    [portReportFootprintArea?.data?.bounds, portReportFootprintArea?.status]
  )
}

export function usePortsReportAreaFootprintFitBounds() {
  const { loaded, bbox } = usePortsReportAreaFootprintBounds()
  const fitAreaInViewport = useFitAreaInViewport({ padding: 10 })
  const bboxHash = bbox ? bbox.join(',') : ''
  // This ensures that the area is in viewport when then area load finishes
  useEffect(() => {
    if (loaded && bbox?.length) {
      fitAreaInViewport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, bboxHash])
}
