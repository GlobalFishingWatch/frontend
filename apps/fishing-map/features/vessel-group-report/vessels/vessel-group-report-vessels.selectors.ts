import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { IdentityVessel } from '@globalfishingwatch/api-types'
import { OTHER_CATEGORY_LABEL } from 'features/vessel-group-report/vessel-group-report.config'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import {
  selectVGRVesselsResultsPerPage,
  selectVGRVesselFilter,
  selectVGRVesselPage,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { cleanFlagState } from 'features/area-report/reports.selectors'
import { t } from 'features/i18n/i18n'
import {
  FILTER_PROPERTIES,
  FilterProperty,
  getVesselsFiltered,
} from 'features/area-report/reports.utils'
import {
  selectVGRVesselsOrderDirection,
  selectVGRVesselsOrderProperty,
  selectVGRVesselsSubsection,
} from '../vessel-group.config.selectors'
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

export const selectVGRVesselsParsed = createSelector([selectVGRVessels], (vessels) => {
  if (!vessels?.length) return null
  return vessels.map((vessel, index) => {
    const { ssvid, ...vesselData } = getSearchIdentityResolved(vessel)
    const source = getVesselSource(vessel)
    return {
      ...vesselData,
      index: index,
      shipName: formatInfoField(vesselData.shipname, 'name'),
      vesselType: getVesselShipTypeLabel(vesselData),
      gearType: getVesselGearTypeLabel(vesselData),
      flagTranslated: t(`flags:${vesselData.flag as string}` as any),
      flagTranslatedClean: cleanFlagState(t(`flags:${vesselData.flag as string}` as any)),
      source: t(`common.sourceOptions.${source}`, source),
      mmsi: ssvid,
      dataset: vessel.dataset,
    }
  }) as VesselGroupReportVesselParsed[]
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
    if (!start || vessel.transmissionDateFrom < start) {
      start = vessel.transmissionDateFrom
    }
    if (!end || vessel.transmissionDateTo > end) {
      end = vessel.transmissionDateTo
    }
  })
  return { start, end }
})

export const selectVGRVesselsFlags = createSelector([selectVGRVesselsParsed], (vessels) => {
  if (!vessels?.length) return null
  let flags = new Set<string>()
  vessels.forEach((vessel) => {
    if (vessel.flag) {
      flags.add(vessel.flag)
    }
  })
  return flags
})

export const selectVGRVesselsFiltered = createSelector(
  [selectVGRVesselsParsed, selectVGRVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered<VesselGroupReportVesselParsed>(
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
    selectVGRVessels,
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
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.flag)
        break
      case 'shiptypes':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.vesselType.split(', ')[0])
        break
      case 'geartypes':
        vesselsGrouped = groupBy(vessels, (vessel) => vessel.gearType.split(', ')[0])
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
