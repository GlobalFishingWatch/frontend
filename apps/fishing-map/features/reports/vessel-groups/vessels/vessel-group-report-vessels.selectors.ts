import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { IdentityVessel } from '@globalfishingwatch/api-types'
import { OTHER_CATEGORY_LABEL } from 'features/reports/vessel-groups/vessel-group-report.config'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import {
  selectVGRVesselsResultsPerPage,
  selectVGRVesselFilter,
  selectVGRVesselPage,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { t } from 'features/i18n/i18n'
import {
  FILTER_PROPERTIES,
  FilterProperty,
  getVesselsFiltered,
} from 'features/reports/areas/area-reports.utils'
import {
  selectVGRVesselsOrderDirection,
  selectVGRVesselsOrderProperty,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { cleanFlagState } from 'features/reports/activity/vessels/report-activity-vessels.utils'
import { getVesselGroupUniqVessels } from 'features/vessel-groups/vessel-groups.utils'
import { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import { selectVGRVessels } from '../vessel-group-report.slice'
import { VesselGroupReportVesselParsed } from './vessel-group-report-vessels.types'

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
    const { shipname, flag, ...vesselData } = getSearchIdentityResolved(vessel.identity!)
    const source = getVesselSource(vessel.identity)
    return {
      ...vessel,
      shipName: formatInfoField(shipname, 'name') as string,
      vesselType: getVesselShipTypeLabel(vesselData),
      geartype: getVesselGearTypeLabel(vesselData),
      flagTranslated: t(`flags:${flag as string}` as any),
      flagTranslatedClean: cleanFlagState(t(`flags:${flag as string}` as any)),
      source: t(`common.sourceOptions.${source}`, source),
    } as VesselGroupVesselTableParsed
  })
})

type ReportFilterProperty = FilterProperty | 'source'
export const REPORT_FILTER_PROPERTIES: Record<ReportFilterProperty, string[]> = {
  ...FILTER_PROPERTIES,
  source: ['source'],
}

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
  let flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flagTranslated) {
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
      resultsNumber: vessels!?.length,
      totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)

export const selectVGRVesselsGraphDataGrouped = createSelector(
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
        if (a.name === OTHER_CATEGORY_LABEL) {
          return 1
        }
        if (b.name === OTHER_CATEGORY_LABEL) {
          return -1
        }
        return b.value - a.value
      })

    if (orderedGroups.length <= 9) {
      return orderedGroups
    }
    const firstNine = orderedGroups.slice(0, 9)
    const other = orderedGroups.slice(9)

    return [
      ...firstNine,
      {
        name: OTHER_CATEGORY_LABEL,
        value: other.reduce((acc, group) => acc + group.value, 0),
      },
    ]
  }
)
