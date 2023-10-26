import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Dataset, Dataview } from '@globalfishingwatch/api-types'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
  selectTimeRange,
} from 'features/app/app.selectors'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import {
  selectReportArea,
  selectReportAreaDataview,
  selectReportAreaIds,
  selectReportBufferHash,
  selectReportDataviewsWithPermissions,
} from 'features/reports/reports.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { Bbox } from 'types'
import { useSetViewState, useViewStateAtom } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { RFMO_DATAVIEW_SLUG } from 'data/workspaces'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getMapCoordinatesFromBounds } from 'features/map/map-bounds.hooks'
import { LAST_REPORTS_STORAGE_KEY, LastReportStorage } from 'features/reports/reports.config'
import {
  fetchReportVesselsThunk,
  getDateRangeHash,
  getReportQuery,
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
  const area = useSelector(selectReportArea)
  const bbox = area?.geometry?.bbox || area!?.bounds
  const areaCenter = useReportAreaCenter(bbox as Bbox)
  return (
    viewState?.latitude === areaCenter?.latitude &&
    viewState?.longitude === areaCenter?.longitude &&
    viewState?.zoom === areaCenter?.zoom
  )
}

export function useFitAreaInViewport() {
  const setViewState = useSetViewState()
  const area = useSelector(selectReportArea)
  const bbox = area?.geometry?.bbox || area!?.bounds
  const areaCenter = useReportAreaCenter(bbox as Bbox)
  const areaInViewport = useReportAreaInViewport()
  return useCallback(() => {
    if (!areaInViewport && areaCenter) {
      setViewState(areaCenter)
    }
  }, [areaCenter, areaInViewport, setViewState])
}

// 0 - 20MB No simplifyTrack
// 20 - 200MG SIMPLIFY FINE_SIMPLIFY_TOLERANCE
// > 200 SIMPLIFY COARSE
export const COARSE_SIMPLIFY_TOLERANCE = 0.1
export const FINE_SIMPLIFY_TOLERANCE = 0.001

export function getSimplificationByDataview(dataview: UrlDataviewInstance | Dataview) {
  return dataview?.slug === RFMO_DATAVIEW_SLUG ? COARSE_SIMPLIFY_TOLERANCE : FINE_SIMPLIFY_TOLERANCE
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
  const [_, setLastReportUrl] = useLocalStorage<LastReportStorage[]>(LAST_REPORTS_STORAGE_KEY, [])
  const timerange = useSelector(selectTimeRange)
  const timerangeSupported = getDownloadReportSupported(timerange.start, timerange.end)
  const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferOperation = useSelector(selectReportBufferOperation)
  const reportBufferHash = useSelector(selectReportBufferHash)

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
        const reportUrlsExists = lastReportUrls.some((report) => report.reportUrl !== undefined)
        return reportUrlsExists ? lastReportUrls : [newReportUrl, lastReportUrls[0]]
      })
    },
    [setLastReportUrl]
  )

  const dispatchFetchReport = useCallback(() => {
    const params = {
      datasets: reportDataviews.map(({ datasets }) =>
        datasets?.map((d: Dataset) => d.id).join(',')
      ),
      filters: reportDataviews.map(({ filter }) => filter),
      vesselGroups: reportDataviews.map(({ vesselGroups }) => vesselGroups),
      region: {
        id: areaId,
        dataset: datasetId,
      },
      dateRange: timerange,
      spatialAggregation: true,
      reportBufferUnit,
      reportBufferValue,
      reportBufferOperation,
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
    timerange,
    updateWorkspaceReportUrls,
  ])

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
          datasets: reportDataviews.map(({ datasets }) =>
            datasets.map((d: Dataset) => d.id).join(',')
          ),
          filters: reportDataviews.map(({ filter }) => filter),
          vesselGroups: reportDataviews.map(({ vesselGroups }) => vesselGroups),
          region: {
            id: areaId,
            dataset: datasetId,
          },
          dateRange: timerange,
          spatialAggregation: true,
          reportBufferUnit,
          reportBufferValue,
          reportBufferOperation,
        })
      )
      dispatchFetchReport()
    }
    // Avoid re-fetching when timerange changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    areaId,
    datasetId,
    reportBufferHash,
    reportDataviews,
    timerangeSupported,
    reportDateRangeHash,
    workspaceStatus,
  ])

  return useMemo(
    () => ({ status, data, error, dispatchFetchReport }),
    [status, data, error, dispatchFetchReport]
  )
}
