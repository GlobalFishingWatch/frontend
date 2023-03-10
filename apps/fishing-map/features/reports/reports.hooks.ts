import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { UserData } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import { getActiveDatasetsInActivityDataviews } from 'features/datasets/datasets.utils'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { selectUserData } from 'features/user/user.slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { Bbox } from 'types'
import useViewport, { getMapCoordinatesFromBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { getDownloadReportSupported } from 'features/download/download.utils'
import {
  fetchReportVesselsThunk,
  selectReportVesselsData,
  selectReportVesselsError,
  selectReportVesselsStatus,
} from './reports.slice'

export type DateTimeSeries = {
  date: string
  values: number[]
  compareDate?: string
}[]

export function useReportAreaCenter(bounds: Bbox) {
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
  const { viewport } = useViewport()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const area = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const areaCenter = useReportAreaCenter(area?.bounds)
  return (
    viewport?.latitude === areaCenter?.latitude &&
    viewport?.longitude === areaCenter?.longitude &&
    viewport?.zoom === areaCenter?.zoom
  )
}

export function useFitAreaInViewport() {
  const { setMapCoordinates } = useViewport()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const area = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const areaCenter = useReportAreaCenter(area?.bounds)
  const areaInViewport = useReportAreaInViewport()
  return useCallback(() => {
    if (!areaInViewport) {
      setMapCoordinates(areaCenter)
    }
  }, [areaCenter, areaInViewport, setMapCoordinates])
}

export function useReportAreaHighlight(areaId: string, sourceId: string) {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())

  const setHighlightedArea = useCallback(
    (areaId, sourceId) => {
      cleanFeatureState('highlight')
      const featureState = {
        source: sourceId,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id: areaId.toString(),
      }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )

  useEffect(() => {
    if (areaId && sourceId) {
      setHighlightedArea(areaId, sourceId)
    }
  }, [areaId, sourceId, setHighlightedArea])
}

export function useFetchReportArea() {
  const dispatch = useAppDispatch()
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const status = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const data = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))
  const reportAreaDataset = useSelector(selectDatasetById(datasetId))

  useEffect(() => {
    if (reportAreaDataset && areaId) {
      dispatch(
        fetchAreaDetailThunk({
          dataset: reportAreaDataset,
          areaId: areaId.toString(),
          simplify: 0.1,
        })
      )
    }
  }, [areaId, reportAreaDataset, dispatch])

  return useMemo(() => ({ status, data }), [status, data])
}

function getReportDataviews(dataviews: UrlDataviewInstance[], userData: UserData) {
  return dataviews
    .map((dataview) => {
      const datasets = getActiveDatasetsInActivityDataviews([dataview])
      return {
        datasets: datasets,
        filter: dataview.config?.filter || [],
        ...(dataview.config?.['vessel-groups']?.length && {
          vesselGroups: dataview.config?.['vessel-groups'],
        }),
      }
    })
    .filter((dataview) => dataview.datasets.length > 0)
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const timerange = useSelector(selectTimeRange)
  const timerangeSupported = getDownloadReportSupported(timerange.start, timerange.end)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveReportDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)

  useEffect(() => {
    const reportDataviews = getReportDataviews(dataviews, userData)
    if (areaId && reportDataviews?.length && timerangeSupported) {
      dispatch(
        fetchReportVesselsThunk({
          datasets: reportDataviews.map(({ datasets }) => datasets.join(',')),
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
  }, [dispatch, areaId, datasetId, timerange, dataviews, userData, timerangeSupported])

  return useMemo(() => ({ status, data, error }), [status, data, error])
}
