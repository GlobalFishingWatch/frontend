import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'

import type { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { DatasetTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'

import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { MAX_CATEGORIES } from 'features/reports/areas/area-reports.config'
import { getVesselsFiltered } from 'features/reports/areas/area-reports.utils'
import { cleanFlagState } from 'features/reports/shared/activity/vessels/report-activity-vessels.utils'
import { getVesselIndividualGroupedData } from 'features/reports/shared/reports.utils'
import {
  selectVGREventsVesselsProperty,
  selectVGRVesselFilter,
  selectVGRVesselPage,
  selectVGRVesselsOrderDirection,
  selectVGRVesselsOrderProperty,
  selectVGRVesselsResultsPerPage,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import {
  OTHER_CATEGORY_LABEL,
  REPORT_FILTER_PROPERTIES,
} from 'features/reports/vessel-groups/vessel-group-report.config'
import { getSearchIdentityResolved, getVesselProperty } from 'features/vessel/vessel.utils'
import { getVesselGroupUniqVessels } from 'features/vessel-groups/vessel-groups.utils'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import { selectVGREventsVesselsFiltered } from '../events/vgr-events.selectors'
import { selectVGRVessels } from '../vessel-group-report.slice'

import type { VesselGroupReportVesselParsed } from './vessel-group-report-vessels.types'

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

export const selectVGRUniqVessels = createSelector([selectVGRVessels], (vessels) => {
  if (!vessels?.length) {
    return
  }
  return getVesselGroupUniqVessels(vessels).filter((v) => v.identity)
})

export const selectVGRVesselsParsed = createSelector([selectVGRUniqVessels], (vessels) => {
  if (!vessels?.length) {
    return
  }
  return getVesselGroupUniqVessels(vessels).flatMap((vessel) => {
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

export const selectVGRVesselsTimeRange = createSelector([selectVGRVesselsParsed], (vessels) => {
  if (!vessels?.length) return null
  let start: string = ''
  let end: string = ''
  vessels.forEach((vessel) => {
    const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel.identity!)
    if (!start || transmissionDateFrom < start) {
      start = transmissionDateFrom
    }
    if (!end || transmissionDateTo > end) {
      end = transmissionDateTo
    }
  })
  return { start, end }
})

export const selectVGRVesselsFlags = createSelector([selectVGRVesselsParsed], (vessels) => {
  if (!vessels?.length) return null
  const flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated && vessel.flagTranslated !== 'null') {
      flags.add(vessel.flagTranslated)
    }
  })
  return flags
})

export const selectVGRVesselsFiltered = createSelector(
  [selectVGRVesselsParsed, selectVGRVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered<VesselGroupVesselTableParsed>(
      vessels,
      filter,
      REPORT_FILTER_PROPERTIES
    )
  }
)

export const selectVGRVesselsOrdered = createSelector(
  [selectVGRVesselsFiltered, selectVGRVesselsOrderProperty, selectVGRVesselsOrderDirection],
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

export const selectVGRVesselsPaginated = createSelector(
  [selectVGRVesselsOrdered, selectVGRVesselPage, selectVGRVesselsResultsPerPage],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectVGRVesselsPagination = createSelector(
  [
    selectVGRVesselsPaginated,
    selectVGRUniqVessels,
    selectVGRVesselsFiltered,
    selectVGRVesselPage,
    selectVGRVesselsResultsPerPage,
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

export const selectVGRVesselsGraphAggregatedData = createSelector(
  [selectVGRVesselsFiltered, selectVGRVesselsSubsection],
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
        group.name.toLowerCase() === OTHER_CATEGORY_LABEL.toLowerCase() ||
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
              name: OTHER_CATEGORY_LABEL,
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
        name: OTHER_CATEGORY_LABEL,
        value: restOfGroups.reduce((acc, group) => acc + group.value, 0),
      },
    ] as ResponsiveVisualizationData<'aggregated'>
  }
)

export const selectVGRVesselsGraphIndividualData = createSelector(
  [selectVGRVesselsFiltered, selectVGRVesselsSubsection],
  (vessels, groupBy) => {
    if (!vessels || !groupBy) return []
    return getVesselIndividualGroupedData(vessels, groupBy)
  }
)

export const selectVGREventsVesselsIndividualData = createSelector(
  [selectVGREventsVesselsFiltered, selectVGREventsVesselsProperty],
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
