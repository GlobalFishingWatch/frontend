import { createSelector } from '@reduxjs/toolkit'
import { selectActiveDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectReportVesselGroupId } from 'routes/routes.selectors'

export const selectVesselGroupReportDataview = createSelector(
  [selectActiveDataviewInstancesResolved, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    return dataviews?.find(({ config }) =>
      config?.filters?.['vessel-groups'].includes(reportVesselGroupId)
    )
  }
)
