import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { VesselGroup } from '@globalfishingwatch/api-types'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

// import { VesselLastIdentity } from 'features/search/search.slice'
// import { ReportVesselWithDatasets } from 'features/reports/report-area/area-reports.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import {
  getVesselGroupLabel,
  getVesselGroupVesselsCount,
} from 'features/vessel-groups/vessel-groups.utils'
import { sortByCreationDate } from 'utils/dates'

import { selectAllVisibleVesselGroups } from './vessel-groups.selectors'
import type { UpdateVesselGroupThunkParams } from './vessel-groups.slice'
import { selectVesselGroupsStatusId, updateVesselGroupVesselsThunk } from './vessel-groups.slice'
import type { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'
import {
  setVesselGroupEditId,
  setVesselGroupModalVessels,
  setVesselGroupsModalOpen,
} from './vessel-groups-modal.slice'

export const NEW_VESSEL_GROUP_ID = 'new-vessel-group'

export type AddVesselGroupVessel =
  | IdentityVesselData
  | VesselGroupVesselIdentity
  | ReportTableVessel

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectAllVisibleVesselGroups)
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)

  return useMemo(() => {
    const vesselGroupsOptions: (MultiSelectOption & { loading?: boolean })[] =
      sortByCreationDate<VesselGroup>(vesselGroups).map((vesselGroup) => ({
        id: vesselGroup.id.toString(),
        label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
          name: getVesselGroupLabel(vesselGroup),
          count: getVesselGroupVesselsCount(vesselGroup),
        }),
        loading: vesselGroup.id === vesselGroupsStatusId,
      }))
    return vesselGroupsOptions
  }, [t, vesselGroups, vesselGroupsStatusId])
}

export const useVesselGroupsUpdate = () => {
  const dispatch = useAppDispatch()
  const addVesselsToVesselGroup = useCallback(
    async (vesselGroupId: string, vessels: VesselGroupVesselIdentity[]) => {
      const vesselGroup: UpdateVesselGroupThunkParams = {
        id: vesselGroupId,
        vessels: vessels,
      }
      const dispatchedAction = await dispatch(updateVesselGroupVesselsThunk(vesselGroup))
      if (updateVesselGroupVesselsThunk.fulfilled.match(dispatchedAction)) {
        return dispatchedAction.payload?.payload as VesselGroup
      } else {
        return undefined
      }
    },
    [dispatch]
  )

  return addVesselsToVesselGroup
}

export const useVesselGroupsModal = () => {
  const dispatch = useAppDispatch()
  const createVesselGroupWithVessels = useCallback(
    async (vesselGroupId: string, vessels: VesselGroupVesselIdentity[]) => {
      if (vessels?.length) {
        if (vesselGroupId && vesselGroupId !== NEW_VESSEL_GROUP_ID) {
          dispatch(setVesselGroupEditId(vesselGroupId))
        }
        dispatch(setVesselGroupModalVessels(vessels))
        dispatch(setVesselGroupsModalOpen(true))
      } else {
        console.warn('No related activity datasets founds for', vessels)
      }
    },
    [dispatch]
  )

  return createVesselGroupWithVessels
}
