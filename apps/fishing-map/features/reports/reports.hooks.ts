import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
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

  useEffect(() => {
    const datasets = dataviews.map((d) => getActiveDatasetsInActivityDataviews([d]))
    if (datasets?.length) {
      dispatch(
        fetchReportVesselsThunk({
          datasets,
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
  }, [dispatch, areaId, datasetId, timerange, dataviews])

  return useMemo(() => ({ status, data }), [status, data])
}
