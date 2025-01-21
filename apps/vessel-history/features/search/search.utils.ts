import type { RelatedVesselSearchMerged, VesselSearch } from '@globalfishingwatch/api-types'

import { sortByDate } from 'utils/shared'

const getMergedVessel = (
  vessel: VesselSearch,
  otherVessel?: RelatedVesselSearchMerged
): RelatedVesselSearchMerged => {
  return {
    ...vessel,
    ...(otherVessel
      ? {
          ...otherVessel,
          firstTransmissionDate:
            vessel.firstTransmissionDate < otherVessel.firstTransmissionDate
              ? vessel.firstTransmissionDate
              : otherVessel.firstTransmissionDate,
          lastTransmissionDate:
            vessel.lastTransmissionDate > otherVessel.lastTransmissionDate
              ? vessel.lastTransmissionDate
              : otherVessel.lastTransmissionDate,
        }
      : {}),
    posCount: vessel.posCount + (otherVessel?.posCount ?? 0),
    years: [...(vessel.years || []), ...(otherVessel?.years || [])],
    relatedVessels: [...(otherVessel?.relatedVessels || []), vessel].sort((v1, v2) =>
      sortByDate(v1.firstTransmissionDate, v2.firstTransmissionDate)
    ),
  }
}

export const mergeSearchVessels = (
  vessels: VesselSearch[],
  mergedField = 'vesselMatchId'
): RelatedVesselSearchMerged[] => {
  const mergedVessels: RelatedVesselSearchMerged[] = []
  vessels.forEach((vessel: VesselSearch) => {
    const existingIndex = vessel[mergedField]
      ? mergedVessels.findIndex((vesselToFind) => vesselToFind[mergedField] === vessel[mergedField])
      : -1
    // If there is already a merged vessel with the same value in the mergedField
    if (existingIndex !== -1) {
      // merge it with the current
      mergedVessels[existingIndex] = getMergedVessel(vessel, mergedVessels[existingIndex])
    } else {
      // otherwise add it as a new vessel
      mergedVessels.push(getMergedVessel(vessel))
    }
  })
  return mergedVessels
}
