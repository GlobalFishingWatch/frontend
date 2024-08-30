import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import { matchSorter } from 'match-sorter'
import { OTHER_CATEGORY_LABEL } from 'features/vessel-group-report/vessel-group-report.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import {
  selectVesselGroupReportResultsPerPage,
  selectVesselGroupReportVesselFilter,
  selectVesselGroupReportVesselPage,
} from 'features/vessel-group-report/vessel-group.config.selectors'
import { formatInfoField, getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { cleanFlagState } from 'features/area-report/reports.selectors'
import { t } from 'features/i18n/i18n'
import {
  selectVesselGroupReportVesselsOrderDirection,
  selectVesselGroupReportVesselsOrderProperty,
  selectVesselGroupReportVesselsSubsection,
} from '../vessel-group.config.selectors'
import { selectVesselGroupReportVessels } from '../vessel-group-report.slice'

type VesselGroupReportVesselParsed = {
  dataset: string
  flag: string
  flagTranslated: string
  flagTranslatedClean: string
  geartype: string
  mmsi: string
  shipName: string
  vesselId: string
  vesselType: string
  source: string
}

export const selectVesselGroupReportVesselsParsed = createSelector(
  [selectVesselGroupReportVessels],
  (vessels) => {
    if (!vessels?.length) return null
    return vessels.map((vessel) => {
      let source = ''
      if (vessel.registryInfo?.length && vessel.selfReportedInfo?.length) {
        source = 'both'
      } else if (vessel.registryInfo?.length) {
        source = 'registry'
      } else if (vessel.selfReportedInfo?.length) {
        source = vessel.selfReportedInfo[0].sourceCode.join(', ')
      }
      return {
        shipName: formatInfoField(getVesselProperty(vessel, 'shipname'), 'name'),
        mmsi: getVesselProperty(vessel, 'ssvid'),
        imo: getVesselProperty(vessel, 'imo'),
        callsign: getVesselProperty(vessel, 'callsign'),
        flag: getVesselProperty(vessel, 'flag'),
        flagTranslated: t(`flags:${getVesselProperty(vessel, 'flag') as string}` as any),
        flagTranslatedClean: cleanFlagState(
          t(`flags:${getVesselProperty(vessel, 'flag') as string}` as any)
        ),
        vesselType: getVesselShipTypeLabel({ shiptypes: getVesselProperty(vessel, 'shiptypes') }),
        geartype: getVesselGearTypeLabel({ geartypes: getVesselProperty(vessel, 'geartypes') }),
        transmissionDateFrom: getVesselProperty(vessel, 'transmissionDateFrom'),
        transmissionDateTo: getVesselProperty(vessel, 'transmissionDateTo'),
        source: t(`common.sourceOptions.${source}`, source),
        dataset: vessel.dataset,
        vesselId: getVesselProperty(vessel, 'id'),
      }
    }) as VesselGroupReportVesselParsed[]
  }
)

type FilterProperty = 'name' | 'flag' | 'mmsi' | 'gear' | 'type' | 'source'
const FILTER_PROPERTIES: Record<FilterProperty, string[]> = {
  name: ['shipName'],
  flag: ['flag', 'flagTranslated', 'flagTranslatedClean'],
  mmsi: ['mmsi'],
  gear: ['geartype'],
  type: ['vesselType'],
  source: ['source'],
}

export function getVesselsFiltered(vessels: VesselGroupReportVesselParsed[], filter: string) {
  if (!filter || !filter.length) {
    return vessels
  }

  const filterBlocks = filter
    .replace(/ ,/g, ',')
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .filter((block) => block.length)

  if (!filterBlocks.length) {
    return vessels
  }

  return filterBlocks.reduce((vessels, block) => {
    const propertiesToMatch =
      block.includes(':') && FILTER_PROPERTIES[block.split(':')[0] as FilterProperty]
    const words = (propertiesToMatch ? (block.split(':')[1] as FilterProperty) : block)
      .replace('-', '')
      .split('|')
      .map((word) => word.trim())
      .filter((word) => word.length)

    const matched = words.flatMap((w) =>
      matchSorter(vessels, w, {
        keys: propertiesToMatch || Object.values(FILTER_PROPERTIES).flat(),
        threshold: matchSorter.rankings.CONTAINS,
      })
    )

    const uniqMatched = block.includes('|') ? Array.from(new Set([...matched])) : matched
    if (block.startsWith('-')) {
      const uniqMatchedIds = new Set<string>()
      uniqMatched.forEach(({ vesselId }) => {
        uniqMatchedIds.add(vesselId)
      })
      return vessels.filter(({ vesselId }) => !uniqMatchedIds.has(vesselId))
    } else {
      return uniqMatched
    }
  }, vessels)
}

export const selectVesselGroupReportVesselsFiltered = createSelector(
  [selectVesselGroupReportVesselsParsed, selectVesselGroupReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered(vessels, filter)
  }
)

export const selectVesselGroupReportVesselsOrdered = createSelector(
  [
    selectVesselGroupReportVesselsFiltered,
    selectVesselGroupReportVesselsOrderProperty,
    selectVesselGroupReportVesselsOrderDirection,
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

export const selectVesselGroupReportVesselsPaginated = createSelector(
  [
    selectVesselGroupReportVesselsOrdered,
    selectVesselGroupReportVesselPage,
    selectVesselGroupReportResultsPerPage,
  ],
  (vessels, page, resultsPerPage) => {
    if (!vessels?.length) return []
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectVesselGroupReportVesselsPagination = createSelector(
  [
    selectVesselGroupReportVesselsPaginated,
    selectVesselGroupReportVessels,
    selectVesselGroupReportVesselsFiltered,
    selectVesselGroupReportVesselPage,
    selectVesselGroupReportResultsPerPage,
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

export const selectVesselGroupReportVesselsGraphDataGrouped = createSelector(
  [selectVesselGroupReportVesselsFiltered, selectVesselGroupReportVesselsSubsection],
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
