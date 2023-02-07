import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DateRange } from 'features/download/downloadActivity.slice'
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
  const { timerange } = useTimerangeConnect()
  const dispatch = useAppDispatch()
  const locationDatasetId = useSelector(selectLocationDatasetId)
  const locationAreaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const datasets = getActiveDatasetsInActivityDataviews(dataviews)
  const status = useSelector(selectReportVesselsStatus)
  const data = useSelector(selectReportVesselsData)

  useEffect(() => {
    if (!data && datasets?.length) {
      dispatch(
        fetchReportVesselsThunk({
          datasets,
          region: {
            id: locationAreaId,
            dataset: locationDatasetId,
          },
          dateRange: timerange as DateRange,
          temporalResolution: 'daily',
          spatialAggregation: true,
        })
      )
    }
  }, [datasets, dispatch, locationAreaId, locationDatasetId, data, timerange])

  return useMemo(() => ({ status, data }), [status, data])
}
