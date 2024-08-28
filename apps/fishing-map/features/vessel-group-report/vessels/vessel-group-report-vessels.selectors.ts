import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { selectVesselGroupReportVesselsSubsection } from 'features/vessel-group-report/vessel.config.selectors'
import { OTHER_CATEGORY_LABEL } from 'features/vessel-group-report/vessel-group-report.config'
import { selectVesselGroupReportVessels } from '../vessel-group-report.slice'

export const selectVesselGroupReportVesselsGraphDataGrouped = createSelector(
  [selectVesselGroupReportVessels, selectVesselGroupReportVesselsSubsection],
  (vessels, subsection) => {
    if (!vessels) return []
    let vesselsGrouped = {}
    switch (subsection) {
      case 'flag':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.selfReportedInfo[0].flag)
        break
      case 'shiptypes':
        vesselsGrouped = groupBy(
          vessels,
          (vessel) => vessel.combinedSourcesInfo[0].shiptypes[0].name
        )
        break
      case 'geartypes':
        vesselsGrouped = groupBy(
          vessels,
          (vessel) => vessel.combinedSourcesInfo[0].geartypes[0].name
        )
        break
    }
    const orderedGroups = Object.entries(vesselsGrouped)
      .map(([key, value]) => ({
        name: key,
        value: (value as any[]).length,
      }))
      .sort((a, b) => {
        if (a.name === OTHER_CATEGORY_LABEL) {
          return 1
        }
        if (b.name === OTHER_CATEGORY_LABEL) {
          return -1
        }
        return b.value - a.value
      })

    if (orderedGroups.length <= 9) {
      return orderedGroups
    }
    const firstTen = orderedGroups.slice(0, 9)
    const other = orderedGroups.slice(9)

    return [
      ...firstTen,
      {
        name: OTHER_CATEGORY_LABEL,
        value: other.reduce((acc, group) => acc + group.value, 0),
      },
    ]
  }
)
