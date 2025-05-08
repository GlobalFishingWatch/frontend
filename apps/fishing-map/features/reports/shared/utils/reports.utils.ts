import { groupBy, sum, uniq } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  DEFAULT_LABEL_KEY,
  getResponsiveVisualizationItemValue,
  type ResponsiveVisualizationData,
} from '@globalfishingwatch/responsive-visualizations'

import {
  EMPTY_API_VALUES,
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
} from 'features/reports/reports.config'
import type {
  ReportCategory,
  ReportVesselGraph,
  ReportVesselsSubCategory,
} from 'features/reports/reports.types'
import { EMPTY_FIELD_PLACEHOLDER, getVesselShipTypeLabel } from 'utils/info'

import type { ReportVesselWithDatasets } from '../../report-area/area-reports.selectors'
import type { ReportTableVessel } from '../vessels/report-vessels.types'

type VesselVisualizationData = ResponsiveVisualizationData<
  'individual',
  { name: string; values: any[] }
>

export const REPORT_VESSELS_GRAPH_LABEL_KEY = 'name'

export function getAggregatedDataWithOthers(
  data: ResponsiveVisualizationData<'aggregated'>,
  dataviewIds: string[],
  labelKey = DEFAULT_LABEL_KEY
) {
  const distributionKeys = data.map((d) => d[labelKey])

  if (!data?.length) return null
  if (distributionKeys.length <= MAX_CATEGORIES) return data

  const top = data.slice(0, MAX_CATEGORIES)
  const rest = data.slice(MAX_CATEGORIES)
  const others = {
    [labelKey]: OTHERS_CATEGORY_LABEL,
    others: rest
      .map((other) => ({
        [labelKey]: other[labelKey],
        value: sum(dataviewIds.map((id) => getResponsiveVisualizationItemValue(other[id]) || 0)),
      }))
      .sort((a, b) => b.value - a.value),
    ...Object.fromEntries(
      dataviewIds.map((valueKey) => [
        valueKey,
        { value: sum(rest.map((key: any) => key[valueKey]?.value)) },
      ])
    ),
  }
  return [...top, others] as ResponsiveVisualizationData<'aggregated'>
}

export function getVesselAggregatedGroupedData(
  vessels: ReportTableVessel[],
  dataviews: UrlDataviewInstance[],
  subsection: ReportVesselsSubCategory | ReportVesselGraph
) {
  const reportData = groupBy(vessels, (v) => v.dataviewId || '')

  const dataByDataview = dataviews.map((dataview) => {
    const dataviewData = reportData[dataview.id]
      ? Object.values(reportData[dataview.id]).flatMap((v) => v || [])
      : []

    let dataByKey = {} as Record<any, ReportTableVessel[]>
    switch (subsection) {
      case 'flag':
        dataByKey = groupBy(dataviewData, (vessel) => vessel.flagTranslatedClean)
        break
      case 'vesselType':
        dataByKey = groupBy(dataviewData, (vessel) => vessel.vesselType.split(', ')[0])
        break
      case 'geartype':
        dataByKey = groupBy(dataviewData, (vessel) => vessel.geartype.split(', ')[0])
        break
      case 'source':
        dataByKey = groupBy(dataviewData, (vessel) => vessel.source as string)
    }
    // const dataByKey = groupBy(dataviewData, (d) => d[reportGraph] || '')
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
      if (sum(dataviewIds.map((d) => distributionData[d])) === 0) return []
      return distributionData as ResponsiveVisualizationData<'aggregated'>
    })
    .sort((a, b) => {
      if (
        EMPTY_API_VALUES.includes(a.name as string) ||
        // This moves the "other" category from the api to the end to group when feasible
        a.name === getVesselShipTypeLabel({ shiptypes: 'other' })
      )
        return 1
      if (
        EMPTY_API_VALUES.includes(b.name as string) ||
        b.name === getVesselShipTypeLabel({ shiptypes: 'other' })
      )
        return -1
      return (
        sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(b[d]))) -
        sum(dataviewIds.map((d) => getResponsiveVisualizationItemValue(a[d])))
      )
    })

  return getAggregatedDataWithOthers(data, dataviewIds, REPORT_VESSELS_GRAPH_LABEL_KEY)
}

export function getVesselIndividualGroupedData(
  vessels: (ReportTableVessel | ReportVesselWithDatasets)[],
  groupByProperty: ReportCategory | ReportVesselsSubCategory | ReportVesselGraph,
  dataviewsIdsOrder?: string[]
) {
  if (!vessels?.length) {
    return []
  }
  const vesselsSorted = dataviewsIdsOrder
    ? vessels.toSorted((a, b) => {
        const aValue = (a as ReportVesselWithDatasets).dataviewId
          ? dataviewsIdsOrder.indexOf((a as ReportVesselWithDatasets).dataviewId as string)
          : 0
        const bValue = (b as ReportVesselWithDatasets).dataviewId
          ? dataviewsIdsOrder.indexOf((b as ReportVesselWithDatasets).dataviewId as string)
          : 0
        return aValue - bValue
      })
    : vessels

  let vesselsGrouped = {}
  switch (groupByProperty) {
    case 'flag': {
      vesselsGrouped = groupBy(
        vesselsSorted,
        (vessel) => (vessel.flagTranslatedClean || vessel.flagTranslated || vessel.flag) as string
      )
      break
    }
    case 'vesselType': {
      vesselsGrouped = groupBy(
        vesselsSorted,
        (vessel) => vessel.vesselType?.split(', ')[0] as string
      )
      break
    }
    case 'geartype': {
      vesselsGrouped = groupBy(vesselsSorted, (vessel) => vessel.geartype?.split(', ')[0] as string)
      break
    }
    case 'source': {
      vesselsGrouped = groupBy(
        vesselsSorted,
        (vessel) => (vessel as ReportTableVessel).source as string
      )
      break
    }
  }
  const orderedGroups: VesselVisualizationData = Object.entries(vesselsGrouped)
    .map(([key, value]) => ({
      name: key,
      values: value as any[],
    }))
    .sort((a, b) => {
      return b.values.length - a.values.length
    })
  const groupsWithoutOther: VesselVisualizationData = []
  const otherGroups: VesselVisualizationData = []
  orderedGroups.forEach((group) => {
    if (
      group.name === 'null' ||
      group.name.toLowerCase() === OTHERS_CATEGORY_LABEL.toLowerCase() ||
      group.name === EMPTY_FIELD_PLACEHOLDER
    ) {
      otherGroups.push(group)
    } else {
      groupsWithoutOther.push(group)
    }
  })
  const allGroups =
    otherGroups.length > 0
      ? [
          ...groupsWithoutOther,
          {
            name: OTHERS_CATEGORY_LABEL,
            values: otherGroups.flatMap((group) => group.values),
          },
        ]
      : groupsWithoutOther
  if (allGroups.length <= MAX_CATEGORIES) {
    return allGroups as VesselVisualizationData
  }
  const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
  const restOfGroups = allGroups.slice(MAX_CATEGORIES)

  return [
    ...firstGroups,
    {
      name: OTHERS_CATEGORY_LABEL,
      values: restOfGroups.flatMap((group) => group.values),
    },
  ] as VesselVisualizationData
}
