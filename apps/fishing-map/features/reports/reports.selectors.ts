import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, sumBy, uniq, uniqBy } from 'lodash'
import { ReportVessel } from '@globalfishingwatch/api-types'
import {
  selectReportActivityGraph,
  selectReportVesselGraph,
  selectReportVesselPage,
} from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { sortStrings } from 'utils/shared'
import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { selectReportVesselsData } from './reports.slice'

export const selectReportActivityFlatten = createSelector(
  [selectReportVesselsData],
  (reportDatasets) => {
    if (!reportDatasets?.length) return null

    return reportDatasets.flatMap((dataset) =>
      Object.entries(dataset).flatMap(([datasetId, vessels]) =>
        (vessels || []).map((vessel) => ({ ...vessel, datasetId }))
      )
    )
  }
)

export const selectReportVesselsNumber = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null
    return uniqBy(vessels, 'vesselId').length
  }
)

export const selectReportVesselsHours = createSelector([selectReportActivityFlatten], (vessels) => {
  if (!vessels?.length) return null

  return vessels.map((vessel) => vessel?.hours || 0).reduce((acc, hours) => acc + hours, 0)
})

export const selectReportActivityGraphData = createSelector(
  [selectReportActivityGraph, selectReportVesselsData, selectActiveHeatmapDataviews],
  (reportGraph, reportData, heatmapDataviews) => {
    if (!reportData?.length) return null

    const dataByDataview = heatmapDataviews.map((dataview, index) => {
      const dataviewData = Object.values(reportData[index]).flat()
      const key = reportGraph === 'evolution' ? 'date' : 'date' // TODO for before/after and periodComparison
      const dataByKey = groupBy(dataviewData, key)
      return { id: dataview.id, data: dataByKey }
    })

    const distributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data))).sort(
      sortStrings
    )

    return distributionKeys.map((key) => {
      const distributionData = { date: key }
      dataByDataview.forEach(({ id, data }) => {
        const hours = sumBy(data[key], 'hours')
        if (hours > 0) {
          distributionData[id] = hours
        }
      })
      return distributionData
    })
  }
)

export const selectReportVesselsGraphData = createSelector(
  [selectReportVesselGraph, selectReportVesselsData, selectActiveHeatmapDataviews],
  (reportGraph, reportData, dataviews) => {
    if (!reportData?.length) return null

    const dataByDataview = dataviews.map((dataview, index) => {
      const dataviewData = reportData[index]
        ? Object.values(reportData[index]).flatMap((v) => v || [])
        : []
      const dataByKey = groupBy(dataviewData, reportGraph.toLowerCase())
      return { id: dataview.id, data: dataByKey }
    })

    const distributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    const data = distributionKeys.map((key) => {
      const distributionData = { name: key }
      dataByDataview.forEach(({ id, data }) => {
        distributionData[id] = uniqBy(data?.[key] || [], 'vesselId').length
      })
      return distributionData
    })
    const dataviewIds = dataviews.map((d) => d.id)
    return data.sort(
      (a, b) => sum(dataviewIds.map((d) => b[d])) - sum(dataviewIds.map((d) => a[d]))
    )
  }
)

export const selectReportVesselsList = createSelector([selectReportActivityFlatten], (vessels) => {
  if (!vessels?.length) return null

  return Object.values(groupBy(vessels, 'vesselId'))
    .map((vesselActivity) => {
      return {
        vesselId: vesselActivity[0]?.vesselId,
        shipName: vesselActivity[0]?.shipName,
        mmsi: vesselActivity[0]?.mmsi,
        flag: vesselActivity[0]?.flag,
        geartype: vesselActivity[0]?.geartype,
        hours: sumBy(vesselActivity, 'hours'),
      } as ReportVessel
    })
    .sort((a, b) => b.hours - a.hours)
})

export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsList, selectReportVesselPage],
  (vessels, page = 0) => {
    if (!vessels?.length) return null
    return vessels.slice(REPORT_VESSELS_PER_PAGE * page, REPORT_VESSELS_PER_PAGE * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [selectReportVesselsList, selectReportVesselPage],
  (vessels, page = 0) => {
    if (!vessels?.length) return null
    return {
      page,
      offset: REPORT_VESSELS_PER_PAGE * page,
      results: REPORT_VESSELS_PER_PAGE,
      total: vessels.length,
    }
  }
)
