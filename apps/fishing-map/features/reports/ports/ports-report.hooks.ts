import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportPortId, selectUrlTimeRange } from 'routes/routes.selectors'
import { fetchPortsReportThunk } from './ports-report.slice'
import { selectPortReportDatasetId } from './ports-report.config.selectors'

export function useFetchPortsReport() {
  const dispatch = useAppDispatch()
  const portId = useSelector(selectReportPortId)
  const datasetId = useSelector(selectPortReportDatasetId)
  const { start, end } = useSelector(selectUrlTimeRange) || {}

  useEffect(() => {
    if (portId && start && end) {
      dispatch(
        fetchPortsReportThunk({
          portId,
          start,
          end,
          datasetId,
        })
      )
    }
  }, [dispatch, end, portId, start, datasetId])

  return
}
