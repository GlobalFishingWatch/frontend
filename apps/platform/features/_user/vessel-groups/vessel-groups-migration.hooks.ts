import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { uniq } from 'es-toolkit'

import {
  type DatasetsMigration,
  type DataviewInstance,
  type VesselGroup,
} from '@globalfishingwatch/api-types'
import { getIsVMSDataset } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  selectDeletedDatasets,
  selectDeprecatedDatasets,
} from 'features/_map/datasets/datasets.slice'
import {
  hasVesselGroupDatasetsDeleted,
  hasVesselGroupDatasetsDeprecated,
} from 'features/_map/dataviews/dataviews.utils'
import { fetchVesselGroupVesselIdentities } from 'features/_reports/report-vessel-group/vessel-group-report.slice'
import type { ReportTableVessel } from 'features/_reports/shared/vessels/report-vessels.types'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import {
  fetchVesselGroupByIdThunk,
  updateVesselGroupVesselsThunk,
} from 'features/_user/vessel-groups/vessel-groups.slice'
import { isOutdatedVesselGroup } from 'features/_user/vessel-groups/vessel-groups.utils'
import { getVesselLatestDatasetId } from 'features/_vessels/vessel/vessel.config'
import type { IdentityVesselData } from 'features/_vessels/vessel/vessel.slice'
import { getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
// import { VesselLastIdentity } from 'features/_vessels/search/search.slice'
// import { ReportVesselWithDatasets } from 'features/_reports/report-area/area-reports.selectors'
import { useAppDispatch } from 'features/app/app.hooks'

import type { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'
import {
  setVesselGroupModalName,
  setVesselGroupModalSearchText,
  setVesselGroupModalSources,
  setVesselGroupSearchIdField,
  setVesselGroupsModalOpen,
} from './vessel-groups-modal.slice'

export function getVesselGroupDatasetStatus(
  vesselGroupDatasets: string[] | undefined,
  deprecatedDatasets: DatasetsMigration,
  deletedDatasets: string[],
  vesselGroup?: VesselGroup
) {
  const hasDeprecatedVesselGroupVessels = hasVesselGroupDatasetsDeprecated(
    vesselGroupDatasets,
    deprecatedDatasets
  )
  const hasDeletedDatasets = hasVesselGroupDatasetsDeleted(vesselGroupDatasets, deletedDatasets)
  const isOutdated =
    (vesselGroup ? isOutdatedVesselGroup(vesselGroup) : false) || hasDeprecatedVesselGroupVessels

  return { isOutdated, hasDeprecatedVesselGroupVessels, hasDeletedDatasets }
}

export function useVesselGroupDatasetStatus(
  vesselGroupDatasets: string[] | undefined,
  vesselGroup?: VesselGroup
) {
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const deletedDatasets = useSelector(selectDeletedDatasets)
  return getVesselGroupDatasetStatus(
    vesselGroupDatasets,
    deprecatedDatasets,
    deletedDatasets,
    vesselGroup
  )
}

export const NEW_VESSEL_GROUP_ID = 'new-vessel-group'

export const VMS_ID_FIELD = 'shipname'

export type AddVesselGroupVessel =
  IdentityVesselData | VesselGroupVesselIdentity | ReportTableVessel

export const useMigrateToLatestVesselGroup = () => {
  const [loadingGroupId, setLoadingGroupId] = useState<VesselGroup['id'] | null>(null)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const deletedDatasets = useSelector(selectDeletedDatasets)
  const userData = useSelector(selectUserData)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  // Vessel ids are kept in the latest version (pipe 4 → 5), so the group only needs its datasets switched.
  // Returns false when the group needs the modal flow (ie: it has v3 vessels), throws on API errors
  const switchVesselGroupToLatest = useCallback(
    async (vesselGroup: VesselGroup) => {
      if (vesselGroup.ownerId !== userData?.id) {
        return false
      }
      const action = await dispatch(fetchVesselGroupByIdThunk(vesselGroup.id))
      if (!fetchVesselGroupByIdThunk.fulfilled.match(action)) {
        throw action.payload
      }
      const vessels = action.payload?.vessels || []
      const updatedVessels = vessels.map((v) => ({
        ...v,
        dataset: getVesselLatestDatasetId(v.dataset, deprecatedDatasets) || v.dataset,
      }))
      const hasOutdatedVessels = updatedVessels.some(
        (v) => deprecatedDatasets[v.dataset] || deletedDatasets.includes(v.dataset)
      )
      if (!vessels.length || hasOutdatedVessels) {
        return false
      }
      if (updatedVessels.every((v, index) => v.dataset === vessels[index].dataset)) {
        // Already switched, the stored vesselsSummary was stale and got updated by the fetch above
        return !isOutdatedVesselGroup(action.payload!)
      }
      const updateAction = await dispatch(
        updateVesselGroupVesselsThunk({
          id: vesselGroup.id,
          override: true,
          vessels: updatedVessels,
        })
      )
      if (!updateVesselGroupVesselsThunk.fulfilled.match(updateAction)) {
        throw updateAction.payload
      }
      return true
    },
    [deletedDatasets, deprecatedDatasets, dispatch, userData?.id]
  )

  const migrateToLatestVesselGroup = useCallback(
    async (vesselGroup: VesselGroup) => {
      if (!vesselGroup?.id) {
        return
      }
      setLoadingGroupId(vesselGroup.id)
      try {
        const switched = await switchVesselGroupToLatest(vesselGroup)
        if (switched) {
          return
        }
        const vesselGroupVessels = await fetchVesselGroupVesselIdentities(vesselGroup?.id)
        const sources = uniq(
          vesselGroupVessels.entries?.flatMap(
            (v) =>
              deprecatedDatasets[v.dataset] ||
              (deletedDatasets.includes(v.dataset) ? [v.dataset] : [])
          )
        )
        const isVMSDataset = sources.some((source) => getIsVMSDataset(source))

        const idField = isVMSDataset ? VMS_ID_FIELD : 'mmsi'
        const text = vesselGroupVessels.entries
          ?.map((v) => getVesselProperty(v, isVMSDataset ? VMS_ID_FIELD : 'ssvid'))
          .join('\n')
        dispatch(setVesselGroupModalSources(sources))
        if (vesselGroup?.name) {
          dispatch(setVesselGroupModalName(`${vesselGroup.name} ${t((t) => t.common.updated)}`))
        }
        dispatch(setVesselGroupSearchIdField(idField))
        dispatch(setVesselGroupModalSearchText(text))
        dispatch(setVesselGroupsModalOpen(true))
      } catch (e: any) {
        console.warn('Error migrating vessel group', e)
        toast.error(
          t((t) => t.vesselGroup.updateError, {
            name: vesselGroup.name,
            error: e?.message || t((t) => t.errors.genericShort),
          })
        )
      } finally {
        setLoadingGroupId(null)
      }
    },
    [deletedDatasets, deprecatedDatasets, dispatch, switchVesselGroupToLatest, t]
  )

  const migrateToLatestVesselGroupByDataview = useCallback(
    async (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      if (dataviewInstance.vesselGroup?.id) {
        await migrateToLatestVesselGroup(dataviewInstance?.vesselGroup)
      }
    },
    [migrateToLatestVesselGroup]
  )

  return useMemo(
    () => ({
      migrateToLatestVesselGroupByDataview,
      migrateToLatestVesselGroup,
      switchVesselGroupToLatest,
      loadingGroupId,
      isLoading: loadingGroupId !== null,
    }),
    [
      migrateToLatestVesselGroupByDataview,
      migrateToLatestVesselGroup,
      switchVesselGroupToLatest,
      loadingGroupId,
    ]
  )
}
