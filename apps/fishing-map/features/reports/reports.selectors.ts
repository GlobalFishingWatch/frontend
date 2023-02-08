import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sumBy, uniq, uniqBy } from 'lodash'
import { ReportVessel } from '@globalfishingwatch/api-types'
import { selectReportVesselGraph } from 'routes/routes.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
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

export const selectReportVesselsGraphData = createSelector(
  [
    selectReportVesselGraph,
    selectReportVesselsData,
    selectReportActivityFlatten,
    selectActiveHeatmapDataviews,
  ],
  (reportGraph, reportData, vessels, heatmapDataviews) => {
    if (!vessels?.length) return null

    const dataByDataview = heatmapDataviews.map((dataview, index) => {
      const dataviewData = Object.values(reportData[index]).flat()
      const dataByKey = groupBy(dataviewData, reportGraph.toLowerCase())
      return { id: dataview.id, data: dataByKey }
    })

    const distributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    return distributionKeys.map((key) => {
      const distributionData = { name: key }
      dataByDataview.forEach(({ id, data }) => {
        distributionData[id] = data[key]?.length || 0
      })
      return distributionData
    })
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
