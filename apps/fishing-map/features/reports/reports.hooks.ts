import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Dataview } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectTimeRange } from 'features/app/app.selectors'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import {
  selectReportAreaDataview,
  selectReportAreaIds,
  selectReportDataviewsWithPermissions,
} from 'features/reports/reports.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { Bbox } from 'types'
import { useViewStateAtom, getMapCoordinatesFromBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { RFMO_DATAVIEW_SLUG } from 'data/workspaces'
import { useHighlightArea } from 'features/map/popups/ContextLayers.hooks'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  fetchReportVesselsThunk,
  getDateRangeHash,
  selectReportVesselsData,
  selectReportVesselsDateRangeHash,
  selectReportVesselsError,
  selectReportVesselsStatus,
} from './report.slice'

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export function useReportAreaCenter(bounds?: Bbox) {
  const map = useMapInstance()
  return useMemo(() => {
    if (!bounds || !map) return null
    const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(map, bounds, {
      padding: FIT_BOUNDS_REPORT_PADDING,
    })
    return { latitude, longitude, zoom }
  }, [bounds, map])
}

export function useReportAreaInViewport() {
  const { viewState } = useViewStateAtom()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const area = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const areaCenter = useReportAreaCenter(area!?.bounds)
  return (
    viewState?.latitude === areaCenter?.latitude &&
    viewState?.longitude === areaCenter?.longitude &&
    viewState?.zoom === areaCenter?.zoom
  )
}

export function useFitAreaInViewport() {
  const { setViewState } = useViewStateAtom()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const area = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const areaCenter = useReportAreaCenter(area!?.bounds)
  const areaInViewport = useReportAreaInViewport()
  return useCallback(() => {
    if (!areaInViewport && areaCenter) {
      setViewState(areaCenter)
    }
  }, [areaCenter, areaInViewport, setViewState])
}

export function useReportAreaHighlight(areaId: string, sourceId: string) {
  const highlightedArea = useHighlightArea()

  useEffect(() => {
    if (areaId && sourceId) {
      highlightedArea({ sourceId, areaId })
    }
  }, [areaId, sourceId, highlightedArea])
}

export function getSimplificationByDataview(dataview: UrlDataviewInstance | Dataview) {
  return dataview?.slug === RFMO_DATAVIEW_SLUG ? 0.1 : 0.001
}

export function useFetchReportArea() {
  const dispatch = useAppDispatch()
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const status = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const data = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const reportAreaDataset = useSelector(selectDatasetById(datasetId))
  const areaDataview = useSelector(selectReportAreaDataview)

  useEffect(() => {
    if (reportAreaDataset && areaId && areaDataview) {
      const simplify = getSimplificationByDataview(areaDataview)
      dispatch(
        fetchAreaDetailThunk({
          dataset: reportAreaDataset,
          areaId,
          simplify,
        })
      )
    }
  }, [areaId, reportAreaDataset, dispatch, areaDataview])

  return useMemo(() => ({ status, data }), [status, data])
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const timerange = useSelector(selectTimeRange)
  const timerangeSupported = getDownloadReportSupported(timerange.start, timerange.end)
  const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  useEffect(() => {
    const isDifferentDateRange = reportDateRangeHash !== getDateRangeHash(timerange)
    if (
      areaId &&
      reportDataviews?.length &&
      timerangeSupported &&
      isDifferentDateRange &&
      workspaceStatus === AsyncReducerStatus.Finished
    ) {
      dispatch(
        fetchReportVesselsThunk({
          datasets: reportDataviews.map(({ datasets }) => datasets.map((d) => d.id).join(',')),
          filters: reportDataviews.map(({ filter }) => filter),
          vesselGroups: reportDataviews.map(({ vesselGroups }) => vesselGroups),
          region: {
            id: areaId,
            dataset: datasetId,
          },
          dateRange: timerange,
          spatialAggregation: true,
        })
      )
    }
    // Avoid re-fetching when timerange changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    areaId,
    datasetId,
    reportDataviews,
    timerangeSupported,
    reportDateRangeHash,
    workspaceStatus,
  ])

  return useMemo(() => ({ status, data, error }), [status, data, error])
}
