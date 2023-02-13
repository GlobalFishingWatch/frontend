import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectLocationDatasetId,
  selectLocationAreaId,
  selectUrlTimeRange,
} from 'routes/routes.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import {
  checkDatasetReportPermission,
  getActiveDatasetsInActivityDataviews,
} from 'features/datasets/datasets.utils'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { selectUserData } from 'features/user/user.slice'
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

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const timerange = useSelector(selectUrlTimeRange)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const data = useSelector(selectReportVesselsData)
  const userData = useSelector(selectUserData)

  const reportDataviews = useMemo(
    () =>
      dataviews
        .map((dataview) => {
          const activityDatasets: string[] = (dataview?.config?.datasets || []).filter(
            (id: string) => {
              return id ? checkDatasetReportPermission(id, userData?.permissions) : false
            }
          )
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
    [dataviews, userData?.permissions]
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
          temporalResolution: 'daily',
          spatialAggregation: true,
        })
      )
    }
  }, [dispatch, areaId, datasetId, timerange, dataviews, reportDataviews])

  return useMemo(() => ({ status, data }), [status, data])
}
