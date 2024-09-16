import { createSelector } from '@reduxjs/toolkit'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getSearchIdentityResolved, getVesselId } from 'features/vessel/vessel.utils'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { GAP_INSIGHT_ID, selectVesselGroupGapInsightData } from '../vessel-group-report.selectors'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'

export const selectVesselGroupReportGapVessels = createSelector(
  [selectVesselGroupGapInsightData, selectVesselGroupReportData, selectAllDatasets],
  (data, vesselGroup, allDatasets) => {
    if (!data || !vesselGroup) {
      return
    }
    const vesselsWithInsigth = data?.gap?.map((vessel) => vessel.vesselId)
    const vessels = vesselGroup?.vessels?.filter((vessel) =>
      vesselsWithInsigth?.includes(getVesselId(vessel))
    )
    const vesselsWithDatasets = vessels.map((v) => {
      const dataset = allDatasets.find((d) => d.id === v.dataset)
      const eventsDatasetId = getRelatedDatasetsByType(dataset, DatasetTypes.Events)?.find((d) =>
        d.id.includes(GAP_INSIGHT_ID.toLowerCase())
      )?.id
      return { ...getSearchIdentityResolved(v), eventsDatasetId }
    })
    return vesselsWithDatasets
  }
)
