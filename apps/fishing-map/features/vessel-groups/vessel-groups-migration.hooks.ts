import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { type DataviewInstance, type VesselGroup } from '@globalfishingwatch/api-types'
import { getIsVMSDataset } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

// import { VesselLastIdentity } from 'features/search/search.slice'
// import { ReportVesselWithDatasets } from 'features/reports/report-area/area-reports.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { fetchVesselGroupVesselIdentities } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'

import type { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'
import {
  setVesselGroupModalName,
  setVesselGroupModalSearchText,
  setVesselGroupModalSources,
  setVesselGroupSearchIdField,
  setVesselGroupsModalOpen,
} from './vessel-groups-modal.slice'

export const NEW_VESSEL_GROUP_ID = 'new-vessel-group'

export const VMS_ID_FIELD = 'shipname'

export type AddVesselGroupVessel =
  | IdentityVesselData
  | VesselGroupVesselIdentity
  | ReportTableVessel

export const useMigrateToLatestVesselGroup = () => {
  const [loadingGroupId, setLoadingGroupId] = useState<VesselGroup['id'] | null>(null)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const migrateToLatestVesselGroup = useCallback(
    async (vesselGroup: VesselGroup) => {
      if (vesselGroup?.id) {
        setLoadingGroupId(vesselGroup.id)
        const vesselGroupVessels = await fetchVesselGroupVesselIdentities(vesselGroup?.id)
        const sources = uniq(
          vesselGroupVessels.entries?.flatMap((v) => deprecatedDatasets[v.dataset] || [])
        )
        const isVMSDataset = sources.some((source) => getIsVMSDataset(source))

        const idField = isVMSDataset ? VMS_ID_FIELD : 'mmsi'
        const text = vesselGroupVessels.entries
          ?.map((v) => getVesselProperty(v, isVMSDataset ? VMS_ID_FIELD : 'ssvid'))
          .join(',')
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
    [deprecatedDatasets, dispatch, t]
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
