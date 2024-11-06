import { useCallback } from 'react'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchPortsReportThunk } from './ports-report.slice'

export function useFetchPortsReport() {
  const dispatch = useAppDispatch()

  const fetchPortsReport = useCallback(
    (portId: string) => {
      if (portId) {
        dispatch(
          fetchPortsReportThunk({
            portId,
          })
        )
      }
    },
    [dispatch]
  )

  return fetchPortsReport
}
