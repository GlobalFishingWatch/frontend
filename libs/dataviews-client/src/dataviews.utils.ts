import { DATASET_VERSION_SEPARATOR, PIPE_DATASET_ID } from '@globalfishingwatch/datasets-client'

import {
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
  VESSEL_ENCOUNTER_DATAVIEW_INSTANCE_PREFIX,
} from './config'

export const getVesselIdFromInstanceId = (dataviewInstanceId: string) => {
  const hasEncounterPrefix = dataviewInstanceId?.startsWith(VESSEL_ENCOUNTER_DATAVIEW_INSTANCE_PREFIX)
  const hasVesselPrefix = dataviewInstanceId?.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX)
  
  if (!hasEncounterPrefix && !hasVesselPrefix) {
    return dataviewInstanceId
  }
  
  const prefix = hasEncounterPrefix
    ? VESSEL_ENCOUNTER_DATAVIEW_INSTANCE_PREFIX
    : VESSEL_DATAVIEW_INSTANCE_PREFIX
  return dataviewInstanceId.split(prefix)[1].split(DATASET_VERSION_SEPARATOR)[0]
}

export const getIsVesselDataviewInstanceId = (dataviewInstanceId: string) =>
  dataviewInstanceId?.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX)

export const getIsEncounteredVesselDataviewInstanceId = (dataviewInstanceId: string) =>
  dataviewInstanceId?.startsWith(VESSEL_ENCOUNTER_DATAVIEW_INSTANCE_PREFIX)

export const getVesselDataviewInstanceId = (
  vesselId: string,
  version = PIPE_DATASET_ID as string
) => `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}${DATASET_VERSION_SEPARATOR}${version}`

export const getEncounteredVesselDataviewInstanceId = (vesselId: string) =>
  `${VESSEL_ENCOUNTER_DATAVIEW_INSTANCE_PREFIX}${vesselId}${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}`
