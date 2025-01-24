import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, sumBy, uniq, uniqBy } from 'es-toolkit'
import { t } from 'i18next'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  getResponsiveVisualizationItemValue,
  type ResponsiveVisualizationData,
} from '@globalfishingwatch/responsive-visualizations'

import {
  selectReportCategory,
  selectReportVesselGraph,
} from 'features/app/selectors/app.reports.selector'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import {
  EMPTY_API_VALUES,
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
} from 'features/reports/areas/area-reports.config'
import {
  selectReportResultsPerPage,
  selectReportVesselFilter,
  selectReportVesselPage,
} from 'features/reports/areas/area-reports.config.selectors'
import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import {
  selectReportActivityFlatten,
  selectReportDataviewsWithPermissions,
} from 'features/reports/areas/area-reports.selectors'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import {
  cleanFlagState,
  cleanVesselOrGearType,
} from 'features/reports/shared/activity/vessels/report-activity-vessels.utils'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'
import { getVesselGearTypeLabel } from 'utils/info'

import { getVesselIndividualGroupedData } from '../../reports.utils'

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
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: cleanVesselOrGearType({
            value: vesselActivity[0]?.geartype,
            property: 'geartype',
          }),
          vesselType: cleanVesselOrGearType({
            value: vesselActivity[0]?.vesselType,
            property: 'vesselType',
          }),
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
    return getVesselsFiltered<ReportVesselWithDatasets>(vessels, filter).sort(
      (a, b) => b.value - a.value
    )
  }
)

const defaultVesselsList: ReportVesselWithDatasets[] = []
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage, selectReportResultsPerPage],
  (vessels, page = 0, resultsPerPage) => {
    if (!vessels?.length) return defaultVesselsList
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [
    selectReportVesselsPaginated,
    selectReportVesselsFiltered,
    selectReportVesselsList,
    selectReportVesselPage,
    selectReportResultsPerPage,
  ],
  (vessels, allVesselsFiltered, allVessels, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage,
      resultsNumber: vessels?.length,
      totalFiltered: allVesselsFiltered?.length,
      total: allVessels?.length,
    }
  }
)

const selectReportVesselsGraphData = createSelector(
  [selectReportVesselGraph, selectReportVesselsFiltered, selectReportDataviewsWithPermissions],
  (reportGraph, vesselsFiltered, dataviews) => {
    if (!vesselsFiltered?.length) return null
    const reportData = groupBy(vesselsFiltered, (v) => v.dataviewId || '')

    const dataByDataview = dataviews.map((dataview) => {
      const dataviewData = reportData[dataview.id]
        ? Object.values(reportData[dataview.id]).flatMap((v) => v || [])
        : []
      const dataByKey = groupBy(dataviewData, (d) => d[reportGraph] || '')
      return {
        id: dataview.id,
        color: dataview.config?.color,
        data: dataByKey,
      }
    })

    const allDistributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    const dataviewIds = dataviews.map((d) => d.id)
    const data: ResponsiveVisualizationData<'aggregated'> = allDistributionKeys
      .flatMap((key) => {
        const distributionData: Record<any, any> = { name: key }
        dataByDataview.forEach(({ id, color, data }) => {
          distributionData[id] = { color, value: (data?.[key] || []).length }
        })
        if (sum(dataviewIds.map((d) => distributionData[d])) === 0) return EMPTY_ARRAY
        return distributionData as ResponsiveVisualizationData<'aggregated'>
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name as string)) return 1
        if (EMPTY_API_VALUES.includes(b.name as string)) return -1
        return (
          sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(b[d]))) -
          sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(a[d])))
        )
      })

    return { distributionKeys: data.map((d) => d.name), data }
  }
)

export const REPORT_GRAPH_LABEL_KEY = 'name'
export const selectReportVesselsGraphDataKeys = createSelector(
  [selectReportDataviewsWithPermissions],
  (dataviews) => dataviews.map((dataview) => dataview.id)
)

export const selectReportVesselsGraphDataGrouped = createSelector(
  [selectReportVesselsGraphData, selectReportVesselsGraphDataKeys],
  (reportGraph, valueKeys): ResponsiveVisualizationData<'aggregated'> | null => {
    if (!reportGraph?.data?.length || !valueKeys?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return reportGraph.data
    const top = reportGraph.data.slice(0, MAX_CATEGORIES)
    const rest = reportGraph.data.slice(MAX_CATEGORIES)
    const others = {
      name: OTHERS_CATEGORY_LABEL,
      ...Object.fromEntries(
        valueKeys.map((valueKey) => [
          valueKey,
          { value: sum(rest.map((key: any) => key[valueKey]?.value)) },
        ])
      ),
    }
    return [...top, others]
  }
)

export const selectReportVesselsGraphIndividualData = createSelector(
  [selectReportVesselsFiltered, selectReportVesselGraph, selectReportVesselsGraphDataKeys],
  (vessels, groupBy, valueKeys) => {
    if (!vessels || !groupBy || !valueKeys) return []
    return getVesselIndividualGroupedData(vessels, groupBy, valueKeys)
  }
)

const defaultOthersLabel: ResponsiveVisualizationData<'aggregated'> = []
export const selectReportVesselsGraphDataOthers = createSelector(
  [selectReportVesselsGraphData],
  (reportGraph): ResponsiveVisualizationData<'aggregated'> | null => {
    if (!reportGraph?.data?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return defaultOthersLabel
    const others = reportGraph.data.slice(MAX_CATEGORIES)

    return reportGraph.distributionKeys
      .flatMap((key) => {
        const other = others.find((o) => o.name === key)
        if (!other) return EMPTY_ARRAY
        const { name, ...rest } = other
        return {
          name,
          value: {
            value: sum(Object.values(rest).map((v) => (v as any).value)),
          },
        }
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name as string)) return 1
        if (EMPTY_API_VALUES.includes(b.name as string)) return -1
        return b.value?.value - a.value?.value
      })
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

export const selectReportVesselsListWithAllInfo = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, (v) => v.vesselId))
      .map((vesselActivity) => {
        return {
          ...vesselActivity[0],
          value: sumBy(vesselActivity, (a) => a.value),
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: getVesselGearTypeLabel({ geartypes: vesselActivity[0]?.geartype }),
          vesselType: t(
            `vessel.veeselTypes.${vesselActivity[0]?.vesselType}` as any,
            vesselActivity[0]?.vesselType
          ),
        }
      })
      .sort((a, b) => b.value - a.value)
  }
)
