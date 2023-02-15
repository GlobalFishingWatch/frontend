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
import { selectActiveReportDataviews } from 'features/app/app.selectors'
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
  const dataviews = useSelector(selectActiveReportDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const data = useSelector(selectReportVesselsData)
  const temporalResolution = useSelector(selectReportTemporalResolution)

  useEffect(() => {
    const reportDataviews = dataviews
      .map((dataview) => ({
        datasets: getActiveDatasetsInActivityDataviews([dataview as UrlDataviewInstance]),
        filter: dataview.config?.filter || [],
        ...(dataview.config?.['vessel-groups']?.length && {
          vesselGroups: dataview.config?.['vessel-groups'],
        }),
      }))
      .filter((dataview) => dataview.datasets.length > 0)

    if (reportDataviews?.length) {
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
          temporalResolution,
          spatialAggregation: true,
        })
      )
    }
  }, [dispatch, areaId, datasetId, timerange, temporalResolution, dataviews])

  return useMemo(() => ({ status, data }), [status, data])
}
