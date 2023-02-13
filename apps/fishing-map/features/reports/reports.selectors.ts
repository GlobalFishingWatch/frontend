import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, sumBy, uniq, uniqBy } from 'lodash'
import { matchSorter } from 'match-sorter'
import { t } from 'i18next'
import { Dataset, DatasetTypes, ReportVessel } from '@globalfishingwatch/api-types'
import {
  selectReportActivityGraph,
  selectReportVesselFilter,
  selectReportVesselGraph,
  selectReportVesselPage,
} from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { sortStrings } from 'utils/shared'
import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectReportVesselsData } from './reports.slice'

export const DEFAULT_NULL_VALUE = 'NULL'
export const MAX_CATEGORIES = 5

export type ReportVesselWithDatasets = Partial<ReportVessel> & {
  datasetId: string
  infoDataset?: Dataset
  trackDataset?: Dataset
}

export const selectReportActivityFlatten = createSelector(
  [selectReportVesselsData],
  (reportDatasets): ReportVesselWithDatasets[] => {
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
      const dataviewData = (Object.values(reportData[index]) || []).flat()
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

    const dataviewIds = dataviews.map((d) => d.id)
    const data = distributionKeys
      .map((key) => {
        const distributionData = { name: key }
        dataByDataview.forEach(({ id, data }) => {
          distributionData[id] = uniqBy(data?.[key] || [], 'vesselId').length
        })
        return distributionData
      })
      .sort((a, b) => {
        if (a.name === DEFAULT_NULL_VALUE) return 1
        if (b.name === DEFAULT_NULL_VALUE) return -1
        return sum(dataviewIds.map((d) => b[d])) - sum(dataviewIds.map((d) => a[d]))
      })

    if (distributionKeys.length <= MAX_CATEGORIES) return data

    const top = data.slice(0, MAX_CATEGORIES)
    const rest = data.slice(MAX_CATEGORIES)
    const others = {
      name: 'others',
      ...Object.fromEntries(
        dataviewIds.map((dataview) => [dataview, sum(rest.map((key) => key[dataview]))])
      ),
    }
    return [...top, others]
  }
)

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets],
  (vessels, datasets) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, 'vesselId'))
      .map((vesselActivity) => {
        const activityDataset = datasets.find((d) => d.id === vesselActivity[0]?.datasetId)
        const infoDatasetId = getRelatedDatasetsByType(activityDataset, DatasetTypes.Vessels)?.[0]
          ?.id
        const infoDataset = datasets.find((d) => d.id === infoDatasetId)
        const trackDatasetId = getRelatedDatasetsByType(infoDataset, DatasetTypes.Tracks)?.[0]?.id
        const trackDataset = datasets.find((d) => d.id === trackDatasetId)
        return {
          vesselId: vesselActivity[0]?.vesselId,
          shipName: vesselActivity[0]?.shipName,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          geartype: vesselActivity[0]?.geartype,
          hours: sumBy(vesselActivity, 'hours'),
          infoDataset: infoDataset,
          trackDataset: trackDataset,
        } as ReportVesselWithDatasets
      })
      .sort((a, b) => b.hours - a.hours)
  }
)

export const selectReportVesselsListWithAllInfo = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, 'vesselId'))
      .map((vesselActivity) => {
        return {
          ...vesselActivity[0],
          hours: sumBy(vesselActivity, 'hours'),
        }
      })
      .sort((a, b) => b.hours - a.hours)
  }
)

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsList, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return matchSorter(vessels, filter, {
      keys: [
        'shipName',
        'mmsi',
        (item) => t(`flags:${item.flag as string}` as any, item.flag),
        (item) => t(`vessel.gearTypes.${item.geartype}` as any, item.geartype),
      ],
    }).sort((a, b) => b.hours - a.hours)
  }
)

export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage],
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
