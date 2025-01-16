import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_SEARCH_STATE } from 'features/search/search.config'
import type { VesselSearchState, VesselSearchStateProperty } from 'features/search/search.types'
import { selectLocationQuery } from 'routes/routes.selectors'

type VesselSearchProperty<P extends VesselSearchStateProperty> = Required<VesselSearchState>[P]
function selectVesselSearchStateProperty<P extends VesselSearchStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): VesselSearchProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_SEARCH_STATE[property] as VesselSearchProperty<P>
  })
}

export const selectSearchQuery = selectVesselSearchStateProperty('query')
export const selectSearchOption = selectVesselSearchStateProperty('searchOption')
export const selectSearchInfoSource = selectVesselSearchStateProperty('infoSource')
export const selectSearchFlag = selectVesselSearchStateProperty('flag')
export const selectSearchSources = selectVesselSearchStateProperty('sources')
export const selectSearchTransmissionDateFrom =
  selectVesselSearchStateProperty('transmissionDateFrom')
export const selectSearchTransmissionDateTo = selectVesselSearchStateProperty('transmissionDateTo')
export const selectSearchSsvid = selectVesselSearchStateProperty('ssvid')
export const selectSearchImo = selectVesselSearchStateProperty('imo')
export const selectSearchCallsign = selectVesselSearchStateProperty('callsign')
export const selectSearchOwner = selectVesselSearchStateProperty('owner')
export const selectSearchNationalId = selectVesselSearchStateProperty('nationalId')
export const selectSearchCodMarinha = selectVesselSearchStateProperty('codMarinha')
export const selectSearchGeartypes = selectVesselSearchStateProperty('geartypes')
export const selectSearchShiptypes = selectVesselSearchStateProperty('shiptypes')
export const selectSearchTargetSpecies = selectVesselSearchStateProperty('targetSpecies')
export const selectSearchFleet = selectVesselSearchStateProperty('fleet')
export const selectSearchOrigin = selectVesselSearchStateProperty('origin')

export const selectSearchFilters = createSelector(
  [
    selectSearchFlag,
    selectSearchSources,
    selectSearchTransmissionDateFrom,
    selectSearchTransmissionDateTo,
    selectSearchSsvid,
    selectSearchImo,
    selectSearchCallsign,
    selectSearchOwner,
    selectSearchNationalId,
    selectSearchCodMarinha,
    selectSearchGeartypes,
    selectSearchShiptypes,
    selectSearchTargetSpecies,
    selectSearchFleet,
    selectSearchOrigin,
    selectSearchInfoSource,
  ],
  (
    flag,
    sources,
    transmissionDateFrom,
    transmissionDateTo,
    ssvid,
    imo,
    callsign,
    owner,
    nationalId,
    codMarinha,
    geartypes,
    shiptypes,
    targetSpecies,
    fleet,
    origin,
    infoSource
  ): VesselSearchState => {
    return {
      flag,
      sources,
      transmissionDateFrom,
      transmissionDateTo,
      ssvid,
      imo,
      callsign,
      owner,
      nationalId,
      codMarinha,
      geartypes,
      shiptypes,
      targetSpecies,
      fleet,
      origin,
      infoSource,
    }
  }
)
