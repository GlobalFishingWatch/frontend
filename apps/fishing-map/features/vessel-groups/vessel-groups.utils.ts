import { VesselGroup } from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'
import { VESSEL_GROUPS_REPORT_RELEASE_DATE } from './vessel-groups.config'

export const getVesselGroupLabel = (vesselGroup: VesselGroup) => {
  const isPrivate = !vesselGroup.id.endsWith(`-${PUBLIC_SUFIX}`)
  return `${isPrivate ? '🔒 ' : ''}${vesselGroup.name}`
}

export const isOutdatedVesselGroup = (vesselGroup: VesselGroup) => {
  return vesselGroup?.updatedAt && vesselGroup?.updatedAt < VESSEL_GROUPS_REPORT_RELEASE_DATE
}
