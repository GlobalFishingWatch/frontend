import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Interval } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectLocationDatasetId,
  selectLocationAreaId,
  selectUrlTimeRange,
} from 'routes/routes.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { getActiveDatasetsInActivityDataviews } from 'features/datasets/datasets.utils'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { TemporalResolution } from 'features/download/downloadActivity.config'
import { selectReportTemporalResolution } from 'features/reports/reports.selectors'
import {
  fetchReportVesselsThunk,
  selectReportVesselsData,
  selectReportVesselsStatus,
} from './reports.slice'

export function useFetchReportArea() {
  const dispatch = useAppDispatch()
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const status = useSelector(selectDatasetAreaStatus({ datasetId, areaId: areaId.toString() }))
  const data = useSelector(selectDatasetAreaDetail({ datasetId, areaId: areaId.toString() }))

  useEffect(() => {
    if (datasetId && areaId) {
      dispatch(
        fetchAreaDetailThunk({
          datasetId,
          areaId: areaId.toString(),
        })
      )
    }
  }, [areaId, datasetId, dispatch])

  return useMemo(() => ({ status, data }), [status, data])
}

//TODO: change API to add "hour"
export const REPORT_TEMPORAL_RESOLUTIONS: Record<Interval, TemporalResolution> = {
  hour: TemporalResolution.Daily,
  day: TemporalResolution.Daily,
  month: TemporalResolution.Monthly,
  year: TemporalResolution.Yearly,
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const timerange = useSelector(selectUrlTimeRange)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const data = useSelector(selectReportVesselsData)
  const temporalResolution = useSelector(selectReportTemporalResolution)

  const reportDataviews = useMemo(
    () =>
      dataviews
        .map((dataview) => {
          const activityDatasets = getActiveDatasetsInActivityDataviews([
            dataview as UrlDataviewInstance,
          ])
          return {
            filter: dataview.config?.filter || [],
            filters: dataview.config?.filters || {},
            ...(dataview.config?.['vessel-groups']?.length && {
              'vessel-groups': dataview.config?.['vessel-groups'],
            }),
            datasets: activityDatasets,
          }
        })
        .filter((dataview) => dataview.datasets.length > 0),
    [dataviews]
  )

  useEffect(() => {
    const datasets = dataviews.map((d) => getActiveDatasetsInActivityDataviews([d]))
    if (datasets?.length) {
      dispatch(
        fetchReportVesselsThunk({
          datasets,
          dataviews: reportDataviews,
          region: {
            id: areaId,
            dataset: datasetId,
          },
          dateRange: timerange,
          temporalResolution,
          spatialAggregation: true,
        })
      )
    }
  }, [dispatch, areaId, datasetId, timerange, dataviews, reportDataviews, temporalResolution])

  return useMemo(() => ({ status, data }), [status, data])
}
