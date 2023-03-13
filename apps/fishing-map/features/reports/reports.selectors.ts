import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, sumBy, uniq, uniqBy } from 'lodash'
import { matchSorter } from 'match-sorter'
import { t } from 'i18next'
import {
  Dataset,
  DatasetTypes,
  DataviewCategory,
  ReportVessel,
} from '@globalfishingwatch/api-types'
import {
  selectActiveReportDataviews,
  selectReportActivityGraph,
  selectReportCategory,
  selectReportTimeComparison,
  selectReportVesselFilter,
  selectReportVesselGraph,
  selectReportVesselPage,
} from 'features/app/app.selectors'
import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getActiveDatasetsInActivityDataviews,
  getActivityDatasetsReportSupported,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.utils'
import { selectLocationAreaId, selectLocationDatasetId } from 'routes/routes.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUserData } from 'features/user/user.slice'
import { getUTCDateTime } from 'utils/dates'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { selectReportVesselsData } from './reports.slice'

export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5

export type ReportVesselWithMeta = ReportVessel & {
  activityDatasetId: string
  category: DataviewCategory
}
export type ReportVesselWithDatasets = Partial<ReportVessel> & {
  infoDataset?: Dataset
  trackDataset?: Dataset
}

export const selectReportAreaIds = createSelector(
  [selectLocationAreaId, selectLocationDatasetId],
  (areaId, datasetId) => {
    return { datasetId, areaId: areaId?.toString() }
  }
)

export const selectReportActivityFlatten = createSelector(
  [selectReportVesselsData, selectActiveTemporalgridDataviews],
  (reportDatasets, dataviews): ReportVesselWithMeta[] => {
    if (!reportDatasets?.length) return null

    return reportDatasets.flatMap((dataset) =>
      Object.entries(dataset).flatMap(([datasetId, vessels]) => {
        const category = dataviews.find((dataview) =>
          dataview.config.datasets.includes(datasetId)
        )?.category
        return (vessels || []).flatMap((vessel) => {
          if (
            EMPTY_API_VALUES.includes(vessel.flag) &&
            EMPTY_API_VALUES.includes(vessel.shipName) &&
            EMPTY_API_VALUES.includes(vessel.vesselType) &&
            EMPTY_API_VALUES.includes(vessel.geartype)
          ) {
            return []
          }
          return {
            ...vessel,
            shipName: EMPTY_API_VALUES.includes(vessel.shipName)
              ? t('common.unknownVessel', 'Unknown Vessel')
              : vessel.shipName,
            activityDatasetId: datasetId,
            category,
          } as ReportVesselWithMeta
        })
      })
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
  [selectReportVesselGraph, selectReportVesselsData, selectActiveReportDataviews],
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
        if (EMPTY_API_VALUES.includes(a.name)) return 1
        if (EMPTY_API_VALUES.includes(b.name)) return -1
        return sum(dataviewIds.map((d) => b[d])) - sum(dataviewIds.map((d) => a[d]))
      })

    if (distributionKeys.length <= MAX_CATEGORIES) return data

    const top = data.slice(0, MAX_CATEGORIES)
    const rest = data.slice(MAX_CATEGORIES)
    const others = {
      name: t('analysis.others', 'Others'),
      ...Object.fromEntries(
        dataviewIds.map((dataview) => [dataview, sum(rest.map((key) => key[dataview]))])
      ),
    }
    return [...top, others]
  }
)

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets, selectReportCategory],
  (vessels, datasets, reportCategory) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, 'vesselId'))
      .flatMap((vesselActivity) => {
        if (vesselActivity[0]?.category !== reportCategory) return []
        const infoDataset = datasets.find((d) => vesselActivity[0].dataset === d.id)
        const trackDatasetId = getRelatedDatasetsByType(infoDataset, DatasetTypes.Tracks)?.[0]?.id
        const trackDataset = datasets.find((d) => d.id === trackDatasetId)
        return {
          vesselId: vesselActivity[0]?.vesselId,
          shipName: vesselActivity[0]?.shipName,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          geartype: vesselActivity[0]?.geartype,
          hours: sumBy(vesselActivity, 'hours'),
          infoDataset,
          trackDataset,
        } as ReportVesselWithDatasets
      })
      .sort((a, b) => b.hours - a.hours)
  }
)

export const selectHasReportVessels = createSelector([selectReportVesselsList], (vessels) => {
  return vessels?.length > 0
})

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

function getVesselsFiltered(vessels: ReportVesselWithDatasets[], filter: string) {
  if (!filter || !filter.length) {
    return vessels
  }
  const filterWords = filter.split(' ')
  if (!filterWords) {
    return vessels
  }
  return filterWords
    .reduceRight(
      (vessels, word) =>
        matchSorter(vessels, word, {
          keys: [
            'shipName',
            'mmsi',
            'flag',
            (item) => t(`flags:${item.flag as string}` as any, item.flag),
            (item) => t(`vessel.gearTypes.${item.geartype}` as any, item.geartype),
          ],
          threshold: matchSorter.rankings.ACRONYM,
        }),
      vessels
    )
    .sort((a, b) => b.hours - a.hours)
}

const defaultDownloadVessels = []
export const selectReportDownloadVessels = createSelector(
  [selectReportVesselsListWithAllInfo, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return defaultDownloadVessels

    return getVesselsFiltered(vessels, filter)
  }
)

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsList, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter)
  }
)

const defaultVesselsList = []
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage],
  (vessels, page = 0) => {
    if (!vessels?.length) return defaultVesselsList
    return vessels.slice(REPORT_VESSELS_PER_PAGE * page, REPORT_VESSELS_PER_PAGE * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [selectReportVesselsPaginated, selectReportVesselsList, selectReportVesselPage],
  (vessels, allVessels, page = 0) => {
    return {
      page,
      offset: REPORT_VESSELS_PER_PAGE * page,
      resultsPerPage: REPORT_VESSELS_PER_PAGE,
      resultsNumber: vessels?.length,
      total: allVessels?.length,
    }
  }
)

export const selectIsReportAllowed = createSelector(
  [selectWorkspaceStatus, selectActiveReportDataviews, selectUserData],
  (workspaceStatus, reportDataviews, userData) => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return false
    }
    const datasetsReportAllowed = uniq(
      getActivityDatasetsReportSupported(reportDataviews, userData?.permissions)
    )
    const dataviewDatasets = uniq(getActiveDatasetsInActivityDataviews(reportDataviews))
    return datasetsReportAllowed?.length === dataviewDatasets?.length
  }
)

export const selectShowTimeComparison = createSelector(
  [selectReportActivityGraph],
  (reportActivityGraph) => {
    return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
  }
)

export const selectTimeComparisonValues = createSelector(
  [selectReportTimeComparison],
  (timeComparison) => {
    if (!timeComparison) return null

    const end = getUTCDateTime(timeComparison.start)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()
    const compareEnd = getUTCDateTime(timeComparison.compareStart)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO()

    return {
      start: timeComparison.start,
      end,
      compareStart: timeComparison.compareStart,
      compareEnd,
    }
  }
)

export const selectReportCategoryDataviews = createSelector(
  [selectActiveTemporalgridDataviews, selectReportCategory],
  (temporalgridDataviews, reportCategory) => {
    return temporalgridDataviews.filter((dataview) => dataview.category === reportCategory)
  }
)
