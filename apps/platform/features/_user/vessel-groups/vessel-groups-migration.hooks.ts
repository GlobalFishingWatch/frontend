import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
import { isOutdatedVesselGroup } from 'features/_user/vessel-groups/vessel-groups.utils'
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
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const migrateToLatestVesselGroup = useCallback(
    async (vesselGroup: VesselGroup) => {
      if (vesselGroup?.id) {
        setLoadingGroupId(vesselGroup.id)
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
          dispatch(setVesselGroupModalName(`${t((t) => t.vesselGroup.copyOf)} ${vesselGroup.name}`))
        }
        dispatch(setVesselGroupSearchIdField(idField))
        dispatch(setVesselGroupModalSearchText(text))
        dispatch(setVesselGroupsModalOpen(true))
        setLoadingGroupId(null)
      }
    },
    [deletedDatasets, deprecatedDatasets, dispatch, t]
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
      loadingGroupId,
      isLoading: loadingGroupId !== null,
    }),
    [migrateToLatestVesselGroupByDataview, migrateToLatestVesselGroup, loadingGroupId]
  )
}
