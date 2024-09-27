import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { selectAllVisibleVesselGroups } from 'features/user/selectors/user.permissions.selectors'
import { getVesselGroupLabel } from 'features/vessel-groups/vessel-groups.utils'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
// import { VesselLastIdentity } from 'features/search/search.slice'
// import { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { sortByCreationDate } from 'utils/dates'
import {
  selectVesselGroupsStatusId,
  UpdateVesselGroupThunkParams,
  updateVesselGroupVesselsThunk,
} from './vessel-groups.slice'
import {
  setVesselGroupEditId,
  setVesselGroupModalVessels,
  setVesselGroupsModalOpen,
  VesselGroupVesselIdentity,
} from './vessel-groups-modal.slice'

export const NEW_VESSEL_GROUP_ID = 'new-vessel-group'

export type AddVesselGroupVessel = IdentityVesselData | VesselGroupVesselIdentity

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
          count: vesselGroup.vessels.length,
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
