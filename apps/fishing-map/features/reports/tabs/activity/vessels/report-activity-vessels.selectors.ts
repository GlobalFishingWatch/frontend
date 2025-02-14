import { createSelector } from '@reduxjs/toolkit'
import { groupBy, uniqBy } from 'es-toolkit'

import { DatasetTypes } from '@globalfishingwatch/api-types'

import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import type { ReportVesselWithDatasets } from 'features/reports/report-area/area-reports.selectors'
import { selectReportActivityFlatten } from 'features/reports/report-area/area-reports.selectors'

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets],
  (vessels, datasets) => {
    if (!vessels?.length) return null
    return Object.values(groupBy(vessels, (v) => v.vesselId))
      .flatMap((vesselActivity) => {
        if (!vesselActivity[0]?.vesselId) {
          return []
        }
        const activityDataset = datasets.find((d) => vesselActivity[0].activityDatasetId === d.id)
        const infoDatasetId = getRelatedDatasetByType(activityDataset, DatasetTypes.Vessels)?.id
        const infoDataset = datasets.find((d) => d.id === infoDatasetId)
        const trackDatasetId = getRelatedDatasetByType(
          infoDataset || activityDataset,
          DatasetTypes.Tracks
        )?.id
        const trackDataset = datasets.find((d) => d.id === trackDatasetId)
        return {
          dataviewId: vesselActivity[0]?.dataviewId,
          vesselId: vesselActivity[0]?.vesselId,
          shipName: vesselActivity[0]?.shipName,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          geartype: vesselActivity[0]?.geartype,
          vesselType: vesselActivity[0]?.vesselType,
          value: vesselActivity[0]?.value,
          infoDataset,
          trackDataset,
          color: vesselActivity[0]?.color,
        } as ReportVesselWithDatasets
      })
      .sort((a, b) => (b.value as number) - (a.value as number))
  }
)

export const selectHasReportVessels = createSelector([selectReportVesselsList], (vessels) => {
  return vessels && vessels?.length > 0
})

export const selectReportVesselsNumber = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return uniqBy(vessels, (v) => v.vesselId).length
  }
)

export const selectReportVesselsHours = createSelector([selectReportActivityFlatten], (vessels) => {
  if (!vessels?.length) return null
  return vessels.map((vessel) => vessel?.value || 0).reduce((acc, value) => acc + value, 0)
})
