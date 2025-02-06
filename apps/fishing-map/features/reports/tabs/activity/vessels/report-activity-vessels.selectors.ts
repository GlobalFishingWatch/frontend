import { createSelector } from '@reduxjs/toolkit'
import { groupBy, uniqBy } from 'es-toolkit'

import { DatasetTypes } from '@globalfishingwatch/api-types'

import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import type { ReportVesselWithDatasets } from 'features/reports/report-area/area-reports.selectors'
import { selectReportActivityFlatten } from 'features/reports/report-area/area-reports.selectors'
import { getVesselsFiltered } from 'features/reports/report-area/area-reports.utils'
import {
  selectReportVesselFilter,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
} from 'features/reports/reports.config.selectors'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'

const EMPTY_ARRAY: [] = []

export const selectReportVesselsList = createSelector(
  [
    selectReportActivityFlatten,
    selectAllDatasets,
    selectReportCategory,
    selectIsVesselGroupReportLocation,
  ],
  (vessels, datasets, reportCategory, isVesselGroupReportLocation) => {
    if (!vessels?.length) return null
    return Object.values(groupBy(vessels, (v) => v.vesselId))
      .flatMap((vesselActivity) => {
        const notMatchesCurrentCategory = isVesselGroupReportLocation
          ? !vesselActivity[0]?.dataviewId.includes(reportCategory)
          : vesselActivity[0]?.category !== reportCategory
        if (notMatchesCurrentCategory) {
          return EMPTY_ARRAY
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

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsList, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    if (!filter) return vessels.sort((a, b) => b.value - a.value)
    return getVesselsFiltered<ReportVesselWithDatasets>(vessels, filter).sort(
      (a, b) => b.value - a.value
    )
  }
)

const defaultVesselsList: ReportVesselWithDatasets[] = []
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage, selectReportVesselResultsPerPage],
  (vessels, page = 0, resultsPerPage) => {
    if (!vessels?.length) return defaultVesselsList
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

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
