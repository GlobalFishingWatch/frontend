import { RelatedVesselSearchMerged, VesselSearch } from "@globalfishingwatch/api-types";
import { sortByDate } from "utils/shared";

const getMergedVessel = (vessel: VesselSearch, otherVessel?: RelatedVesselSearchMerged): RelatedVesselSearchMerged => {
  return {
    ...vessel,
    ...(otherVessel ? {
      firstTransmissionDate: vessel.firstTransmissionDate < otherVessel.firstTransmissionDate ? vessel.firstTransmissionDate : otherVessel.firstTransmissionDate,
      lastTransmissionDate: vessel.lastTransmissionDate > otherVessel.lastTransmissionDate ? vessel.lastTransmissionDate : otherVessel.lastTransmissionDate,
    } : {}),
    posCount: vessel.posCount + (otherVessel?.posCount ?? 0),
    years: [...vessel.years || [], ...otherVessel?.years || []],
    relatedVessels: [...otherVessel?.relatedVessels || [], vessel].sort((v1, v2) => sortByDate(v1.firstTransmissionDate, v2.firstTransmissionDate)),
  }
}

export const mergeSearchVessels = (vessels: VesselSearch[], mergedField = 'vesselMatchId'): RelatedVesselSearchMerged[] => {
  const mergedVessels: RelatedVesselSearchMerged[] = []
  vessels.forEach((vessel: VesselSearch) => {
    // If the vessel already exist:
    if (vessel[mergedField]) {
      const existingIndex = mergedVessels.findIndex(vesselToFind => vesselToFind[mergedField] === vessel[mergedField])
      if (mergedVessels[existingIndex]) {
        mergedVessels[existingIndex] = getMergedVessel(vessel, mergedVessels[existingIndex],)
        // add data to main result
      } else {
        const newVessel = getMergedVessel(vessel)
        mergedVessels.push(newVessel)
      }
    } else {
      const newVessel = getMergedVessel(vessel)
      mergedVessels.push(newVessel)
    }

  });
  return mergedVessels
}
