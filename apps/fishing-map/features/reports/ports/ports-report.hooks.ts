import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { AppDispatch } from 'store'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportPortId, selectUrlTimeRange } from 'routes/routes.selectors'

import { selectPortsReportDatasetId } from './ports-report.config.selectors'
import { selectPortReportsConfidences } from './ports-report.selectors'
import { fetchPortsReportThunk } from './ports-report.slice'

let reportAction: (ReturnType<AppDispatch> & { abort?: () => void }) | undefined

export function useFetchPortsReport() {
  const dispatch = useAppDispatch()

  const portId = useSelector(selectReportPortId)
  const datasetId = useSelector(selectPortsReportDatasetId)
  const confidences = useSelector(selectPortReportsConfidences)
  const { start, end } = useSelector(selectUrlTimeRange) || {}

  useEffect(() => {
    if (reportAction?.abort !== undefined) {
      reportAction?.abort?.()
      reportAction = undefined
    }
  }, [start, end])

  const fetchPortReport = useCallback(() => {
    if (portId && start && end) {
      if (reportAction && reportAction.abort !== undefined) {
        reportAction.abort()
      }
      const action = dispatch(
        fetchPortsReportThunk({
          portId,
          start,
          end,
          datasetId,
          confidences,
        })
      )
      reportAction = action
    }
  }, [portId, start, end, dispatch, datasetId, confidences])

  return fetchPortReport
}
