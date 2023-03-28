import { VesselGroup } from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'

export const getVesselGroupLabel = (vesselGroup: VesselGroup) => {
  const isPrivate = !vesselGroup.id.endsWith(`-${PUBLIC_SUFIX}`)
  return `${isPrivate ? '🔒 ' : ''}${vesselGroup.name}`
}
