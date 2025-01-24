import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { AppDispatch } from 'store'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchAreaDetailThunk } from 'features/areas/areas.slice'
import { selectReportPortId, selectUrlTimeRange } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import { selectPortsReportDatasetId } from './ports-report.config.selectors'
import {
  selectPortReportFootprintArea,
  selectPortReportFootprintDatasetId,
  selectPortReportsConfidences,
} from './ports-report.selectors'
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

export function usePortsReportAreaFootprint() {
  const dispatch = useAppDispatch()
  const portReportId = useSelector(selectReportPortId)
  const portReportFootprintArea = useSelector(selectPortReportFootprintArea)
  const portReportFootprintDatasetId = useSelector(selectPortReportFootprintDatasetId)

  useEffect(() => {
    if (!portReportFootprintArea && portReportFootprintDatasetId && portReportId) {
      dispatch(
        fetchAreaDetailThunk({ datasetId: portReportFootprintDatasetId, areaId: portReportId })
      )
    }
  }, [dispatch, portReportFootprintArea, portReportFootprintDatasetId, portReportId])

  return portReportFootprintArea
}
