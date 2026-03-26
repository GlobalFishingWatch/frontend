import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_SEARCH_STATE } from 'features/search/search.config'
import type { VesselSearchState, VesselSearchStateProperty } from 'features/search/search.types'
import { IS_PIPE_4 } from 'features/vessel/vessel.config'
import { selectLocationQuery } from 'router/routes.selectors'

type VesselSearchProperty<P extends VesselSearchStateProperty> = Required<VesselSearchState>[P]
function selectVesselSearchStateProperty<P extends VesselSearchStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): VesselSearchProperty<P> => {
    const urlProperty = locationQuery?.[property as keyof typeof locationQuery]
    if (urlProperty !== undefined) return urlProperty as VesselSearchProperty<P>
    return DEFAULT_SEARCH_STATE[property] as VesselSearchProperty<P>
  })
}

export const selectSearchId = selectVesselSearchStateProperty('id')
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
export const selectSearchGeartypes = selectVesselSearchStateProperty('geartypes')
export const selectSearchShiptypes = selectVesselSearchStateProperty('shiptypes')
export const selectSearchTargetSpecies = selectVesselSearchStateProperty('targetSpecies')
export const selectSearchOrigin = selectVesselSearchStateProperty('origin')

export const selectSearchSelfReportedExternalId = selectVesselSearchStateProperty(
  'selfReportedInfo.externalId'
)
export const selectSearchSelfReportedSourceFleet = selectVesselSearchStateProperty(
  'selfReportedInfo.sourceFleet'
)
export const selectSearchSelfReportedFishingLicenseCode = selectVesselSearchStateProperty(
  'selfReportedInfo.fishingLicenseCode'
)
export const selectSearchSelfReportedFleetCode = selectVesselSearchStateProperty(
  'selfReportedInfo.fleetCode'
)
export const selectSearchSelfReportedVesselRegistrationCode = selectVesselSearchStateProperty(
  'selfReportedInfo.vesselRegistrationCode'
)
export const selectSearchSelfReportedHull = selectVesselSearchStateProperty('selfReportedInfo.hull')
export const selectSearchSelfReportedOrigin =
  selectVesselSearchStateProperty('selfReportedInfo.origin')

//TO DO: remove the below selectors when migrate to pipe 4
export const selectSearchNationalId = selectVesselSearchStateProperty('nationalId')
export const selectSearchCodMarinha = selectVesselSearchStateProperty('codMarinha')
export const selectSearchFleet = IS_PIPE_4
  ? selectVesselSearchStateProperty('selfReportedInfo.sourceFleet')
  : selectVesselSearchStateProperty('fleet')

export const selectSearchFilters = createSelector(
  [
    selectSearchId,
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
    selectSearchSelfReportedExternalId,
    selectSearchSelfReportedSourceFleet,
    selectSearchSelfReportedFishingLicenseCode,
    selectSearchSelfReportedFleetCode,
    selectSearchSelfReportedVesselRegistrationCode,
    selectSearchSelfReportedHull,
    selectSearchSelfReportedOrigin,
  ],
  (
    id,
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
    selfReportedExternalId,
    selfReportedSourceFleet,
    selfReportedFishingLicenseCode,
    selfReportedFleetCode,
    selfReportedVesselRegistrationCode,
    selfReportedHull,
    selfReportedOrigin
  ): VesselSearchState => {
    return {
      id,
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
      'selfReportedInfo.externalId': selfReportedExternalId,
      'selfReportedInfo.fishingLicenseCode': selfReportedFishingLicenseCode,
      'selfReportedInfo.sourceFleet': selfReportedSourceFleet,
      'selfReportedInfo.fleetCode': selfReportedFleetCode,
      'selfReportedInfo.hull': selfReportedHull,
      'selfReportedInfo.origin': selfReportedOrigin,
      'selfReportedInfo.vesselRegistrationCode': selfReportedVesselRegistrationCode,
    }
  }
)
