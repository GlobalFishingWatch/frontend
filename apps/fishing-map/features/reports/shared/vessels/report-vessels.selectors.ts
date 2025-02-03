import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'

import type { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'

import {
  selectReportCategory,
  selectReportSubCategory,
} from 'features/app/selectors/app.reports.selector'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { getVesselsFiltered } from 'features/reports/report-area/area-reports.utils'
import { REPORT_FILTER_PROPERTIES } from 'features/reports/report-vessel-group/vessel-group-report.config'
import { MAX_CATEGORIES, OTHERS_CATEGORY_LABEL } from 'features/reports/reports.config'
import {
  selectReportVesselFilter,
  selectReportVesselGraphSelector,
  selectReportVesselPage,
  selectReportVesselResultsPerPage,
  selectReportVesselsOrderDirection,
  selectReportVesselsOrderProperty,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { getVesselIndividualGroupedData } from 'features/reports/shared/utils/reports.utils'
import { selectReportVesselsList } from 'features/reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { cleanFlagState } from 'features/reports/tabs/activity/vessels/report-activity-vessels.utils'
import { getSearchIdentityResolved, getVesselProperty } from 'features/vessel/vessel.utils'
import { getVesselGroupUniqVessels } from 'features/vessel-groups/vessel-groups.utils'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import { selectVGRVessels } from '../../report-vessel-group/vessel-group-report.slice'
import { selectVGREventsVesselsFiltered } from '../../tabs/events/events-report.selectors'

import type { VesselGroupReportVesselParsed } from './report-vessels.types'

const getVesselSource = (vessel: IdentityVessel) => {
  let source = ''
  if (vessel.registryInfo?.length && vessel.selfReportedInfo?.length) {
    source = 'both'
  } else if (vessel.registryInfo?.length) {
    source = 'registry'
  } else if (vessel.selfReportedInfo?.length) {
    source = vessel.selfReportedInfo[0].sourceCode.join(', ')
  }
  return source
}

export type VesselGroupVesselTableParsed = VesselGroupVesselIdentity & VesselGroupReportVesselParsed

export const selectReportVessels = createSelector(
  [selectReportCategory, selectReportSubCategory, selectReportVesselsList, selectVGRVessels],
  (reportCategory, reportSubCategory, reportVesselsList, vGRVessels) => {
    if (!reportCategory) {
      return []
    }
    if (
      reportCategory === ReportCategory.Activity ||
      reportCategory === ReportCategory.Detections
    ) {
      return reportVesselsList
    }
    if (reportCategory === ReportCategory.VesselGroup) {
      return vGRVessels
    }
    if (reportCategory === ReportCategory.Events) {
      // TODO:CVP add events vessels
      return []
    }
    return []
  }
)

export const selectReportUniqVessels = createSelector([selectReportVessels], (vessels) => {
  if (!vessels?.length) {
    return
  }
  return getVesselGroupUniqVessels(vessels).filter((v) => v.identity)
})

export const selectReportVesselsParsed = createSelector([selectReportUniqVessels], (vessels) => {
  if (!vessels?.length) {
    return
  }
  return vessels.flatMap((vessel) => {
    if (!vessel.identity) {
      return []
    }
    const { shipname, ...vesselData } = getSearchIdentityResolved(vessel.identity!)
    const source = getVesselSource(vessel.identity)
    const vesselType = getVesselShipTypeLabel(vesselData) as string
    const geartype = getVesselGearTypeLabel(vesselData) as string
    const flag = getVesselProperty(vessel.identity, 'flag', {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })

    return {
      ...vessel,
      shipName: formatInfoField(shipname, 'shipname') as string,
      vesselType,
      geartype,
      mmsi: getVesselProperty(vessel.identity, 'ssvid', {
        identitySource: VesselIdentitySourceEnum.SelfReported,
      }),
      flagTranslated: flag ? t(`flags:${flag}` as any) : EMPTY_FIELD_PLACEHOLDER,
      flagTranslatedClean: flag
        ? cleanFlagState(t(`flags:${flag}` as any))
        : EMPTY_FIELD_PLACEHOLDER,
      source: t(`common.sourceOptions.${source}`, source),
    } as VesselGroupVesselTableParsed
  })
})

export const selectReportVesselsTimeRange = createSelector(
  [selectReportVesselsParsed],
  (vessels) => {
    if (!vessels?.length) return null
    let start: string = ''
    let end: string = ''
    vessels.forEach((vessel) => {
      const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(
        vessel.identity!
      )
      if (!start || transmissionDateFrom < start) {
        start = transmissionDateFrom
      }
      if (!end || transmissionDateTo > end) {
        end = transmissionDateTo
      }
    })
    return { start, end }
  }
)

export const selectReportVesselsFlags = createSelector([selectReportVesselsParsed], (vessels) => {
  if (!vessels?.length) return null
  const flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated && vessel.flagTranslated !== 'null') {
      flags.add(vessel.flagTranslated)
    }
  })
  return flags
})

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsParsed, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    if (!filter) return vessels
    return getVesselsFiltered<VesselGroupVesselTableParsed>(
      vessels,
      filter,
      REPORT_FILTER_PROPERTIES
    )
  }
)

export const selectVGRVesselsOrdered = createSelector(
  [
    selectReportVesselsFiltered,
    selectReportVesselsOrderProperty,
    selectReportVesselsOrderDirection,
  ],
  (vessels, property, direction) => {
    if (!vessels?.length) return []
    return vessels.toSorted((a, b) => {
      let aValue = ''
      let bValue = ''
      if (property === 'flag') {
        aValue = a.flagTranslated
        bValue = b.flagTranslated
      } else if (property === 'shiptype') {
        aValue = a.vesselType
        bValue = b.vesselType
      } else {
        aValue = a.shipName
        bValue = b.shipName
      }
      if (aValue === bValue) {
        return 0
      }
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue > bValue ? -1 : 1
    })
  }
)

// TODO:CVP rename all of this prefixed with VGR
export const selectReportVesselsPaginated = createSelector(
  [selectVGRVesselsOrdered, selectReportVesselPage, selectReportVesselResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectVGRVesselsPagination = createSelector(
  [
    selectReportVesselsPaginated,
    selectReportUniqVessels,
    selectReportVesselsFiltered,
    selectReportVesselPage,
    selectReportVesselResultsPerPage,
  ],
  (vessels, allVessels, allVesselsFiltered, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: vessels?.length,
      totalFiltered: allVesselsFiltered?.length || 0,
      total: allVessels?.length || 0,
    }
  }
)

type GraphDataGroup = {
  name: string
  value: number
}

export const selectReportVesselsGraphAggregatedData = createSelector(
  [selectReportVesselsFiltered, selectReportVesselsSubCategory],
  (vessels, subsection) => {
    if (!vessels) return []
    let vesselsGrouped = {}
    switch (subsection) {
      case 'flag':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.flagTranslatedClean)
        break
      case 'shiptypes':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.vesselType.split(', ')[0])
        break
      case 'geartypes':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.geartype.split(', ')[0])
        break
      case 'source':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.source)
    }
    const orderedGroups = Object.entries(vesselsGrouped)
      .map(([key, value]) => ({
        name: key,
        value: (value as any[]).length,
      }))
      .sort((a, b) => {
        return b.value - a.value
      })
    const groupsWithoutOther: GraphDataGroup[] = []
    const otherGroups: GraphDataGroup[] = []
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
              value: otherGroups.reduce((acc, group) => acc + group.value, 0),
            },
          ]
        : groupsWithoutOther
    if (allGroups.length <= MAX_CATEGORIES) {
      return allGroups
    }
    const firstGroups = allGroups.slice(0, MAX_CATEGORIES)
    const restOfGroups = allGroups.slice(MAX_CATEGORIES)

    return [
      ...firstGroups,
      {
        name: OTHERS_CATEGORY_LABEL,
        value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
      },
    ] as ResponsiveVisualizationData<'aggregated'>
  }
)

export const selectReportVesselsGraphIndividualData = createSelector(
  [selectReportVesselsFiltered, selectReportVesselsSubCategory],
  (vessels, groupBy) => {
    if (!vessels || !groupBy) return []
    return getVesselIndividualGroupedData(vessels, groupBy)
  }
)

// TODO:CVP work on this when events are implemented
export const selectVGREventsVesselsIndividualData = createSelector(
  [selectVGREventsVesselsFiltered, selectReportVesselGraphSelector],
  (vessels, groupBy) => {
    if (!vessels || !groupBy) return []
    return getVesselIndividualGroupedData(vessels, groupBy)
  }
)

export function getVesselDatasetsWithoutEventsRelated(
  vessels: VesselGroupVesselIdentity[] | null,
  vesselDatasets: Dataset[]
) {
  if (!vessels?.length) {
    return []
  }
  const datasets = new Set<Dataset>()
  vessels?.forEach((vessel) => {
    const infoDataset = vesselDatasets?.find((dataset) => dataset.id === vessel.dataset)
    if (!infoDataset || datasets.has(infoDataset)) return
    const eventsDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Events)
    if (!eventsDataset) {
      datasets.add(infoDataset)
    }
  })
  return Array.from(datasets)
}

export const selectVGRVesselDatasetsWithoutEventsRelated = createSelector(
  [selectVGRVessels, selectVesselsDatasets],
  (vessels = [], vesselDatasets) => {
    return getVesselDatasetsWithoutEventsRelated(vessels, vesselDatasets)
  }
)
