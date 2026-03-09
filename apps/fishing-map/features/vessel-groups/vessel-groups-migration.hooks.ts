import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { DataviewInstance, VesselGroup } from '@globalfishingwatch/api-types'
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

export type AddVesselGroupVessel =
  | IdentityVesselData
  | VesselGroupVesselIdentity
  | ReportTableVessel

export const useMigrateToLatestVesselGroup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const migrateToLatestVesselGroup = useCallback(
    async (vesselGroup: VesselGroup) => {
      if (vesselGroup?.id) {
        setIsLoading(true)
        const vesselGroupVessels = await fetchVesselGroupVesselIdentities(vesselGroup?.id)
        const text = vesselGroupVessels.entries?.map((v) => getVesselProperty(v, 'ssvid')).join(',')
        const sources = uniq(
          vesselGroupVessels.entries?.flatMap((v) => deprecatedDatasets[v.dataset] || [])
        )
        dispatch(setVesselGroupModalSources(sources))
        if (vesselGroup?.name) {
          dispatch(setVesselGroupModalName(`${t((t) => t.vesselGroup.copyOf)} ${vesselGroup.name}`))
        }
        dispatch(setVesselGroupSearchIdField('mmsi'))
        dispatch(setVesselGroupModalSearchText(text))
        dispatch(setVesselGroupsModalOpen(true))
        setIsLoading(false)
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
    () => ({ migrateToLatestVesselGroupByDataview, migrateToLatestVesselGroup, isLoading }),
    [migrateToLatestVesselGroupByDataview, migrateToLatestVesselGroup, isLoading]
  )
}
