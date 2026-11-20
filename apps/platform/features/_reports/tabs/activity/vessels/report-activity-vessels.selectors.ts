import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, uniqBy } from 'es-toolkit'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getRelatedDatasetByType } from '@globalfishingwatch/datasets-client'

import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import type { ReportVesselWithDatasets } from 'features/_reports/report-area/area-reports.selectors'
import {
  selectReportActivityFlatten,
  selectReportDataviewsWithPermissions,
} from 'features/_reports/report-area/area-reports.selectors'
import {
  getFiltersByDataview,
  getUnmatchedDetections,
  getVesselValue,
} from 'features/_reports/tabs/activity/vessels/report-activity-vessels.utils'

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets, selectReportDataviewsWithPermissions],
  (vessels, datasets, dataviews) => {
    if (!vessels?.length) return null
    const filtersByDataview = getFiltersByDataview(dataviews)
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
          imo: vesselActivity[0]?.imo,
          callsign: vesselActivity[0]?.callsign,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          geartype: vesselActivity[0]?.geartype,
          vesselType: vesselActivity[0]?.vesselType,
          // A vessel in several sublayers counts once: see getVesselValue
          value: getVesselValue(vesselActivity, filtersByDataview),
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

export const selectReportVesselsHours = createSelector(
  [selectReportVesselsList, selectReportActivityFlatten, selectReportDataviewsWithPermissions],
  (vessels, rows, dataviews) => {
    if (!rows?.length) {
      return null
    }
    const vesselsHours = sum((vessels || []).map((vessel) => (vessel.value as number) || 0))
    return vesselsHours + getUnmatchedDetections(rows, dataviews)
  }
)

export const selectReportActivityDatasetIdsWithVessels = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null
    return [...new Set(vessels.map((vessel) => vessel.activityDatasetId))]
  }
)
