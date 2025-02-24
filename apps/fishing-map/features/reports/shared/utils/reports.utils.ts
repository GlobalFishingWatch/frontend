import { groupBy } from 'es-toolkit'

import { type ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'

import { MAX_CATEGORIES, OTHERS_CATEGORY_LABEL } from 'features/reports/reports.config'
import type {
  ReportCategory,
  ReportVesselGraph,
  ReportVesselsSubCategory,
} from 'features/reports/reports.types'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import type { ReportVesselWithDatasets } from '../../report-area/area-reports.selectors'
import type { ReportTableVessel } from '../vessels/report-vessels.types'

type VesselVisualizationData = ResponsiveVisualizationData<
  'individual',
  { name: string; values: any[] }
>

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
