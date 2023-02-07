import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { selectReportVesselsData } from './reports.slice'

export const selectReportVesselsNumber = createSelector([selectReportVesselsData], (vessels) => {
  if (!vessels?.length) return null

  return uniqBy(vessels.flatMap((datasets) => Object.values(datasets)).flat(), 'vesselId').length
})

export const selectReportVesselsHours = createSelector([selectReportVesselsData], (vessels) => {
  if (!vessels?.length) return null

  return vessels
    .flatMap((datasets) => Object.values(datasets).flat())
    .map((vessel) => vessel?.hours || 0)
    .reduce((acc, hours) => acc + hours, 0)
})
