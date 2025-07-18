import { useCallback } from 'react'

import type { VesselGroup } from '@globalfishingwatch/api-types'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupEditId,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups-modal.slice'

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

export function useEditVesselGroupModal() {
  const dispatch = useAppDispatch()

  const onEditClick = useCallback(
    async (vesselGroup: VesselGroup) => {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setVesselGroupsModalOpen(true))
      dispatch(setVesselGroupConfirmationMode('update'))
    },
    [dispatch]
  )

  return onEditClick
}
