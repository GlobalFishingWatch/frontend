import { useCallback } from 'react'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchVesselGroupReportThunk } from './vessel-group-report.slice'

export function useFetchVesselGroupReport() {
  const dispatch = useAppDispatch()

  const fetchVesselGroupReport = useCallback(
    (vesselGroupId: string) => {
      if (vesselGroupId) {
        dispatch(
          fetchVesselGroupReportThunk({
            vesselGroupId,
          })
        )
      }
    },
    [dispatch]
  )

  return fetchVesselGroupReport
}
