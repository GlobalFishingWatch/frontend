import { uniq, uniqBy } from 'es-toolkit'
import {
  IdentityVessel,
  VesselGroup,
  VesselGroupVessel,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'
import { getVesselId, getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import { VESSEL_GROUPS_REPORT_RELEASE_DATE } from './vessel-groups.config'
import { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'

export const getVesselGroupLabel = (vesselGroup: VesselGroup) => {
  const isPrivate = !vesselGroup.id.endsWith(`-${PUBLIC_SUFIX}`)
  return `${isPrivate ? '🔒 ' : ''}${vesselGroup.name}`
}

export const isOutdatedVesselGroup = (vesselGroup: VesselGroup) => {
  return vesselGroup?.updatedAt && vesselGroup?.updatedAt < VESSEL_GROUPS_REPORT_RELEASE_DATE
}

export const getVesselGroupVesselsCount = (vesselGroup: VesselGroup) => {
  return uniq(vesselGroup.vessels.map((v) => v.relationId || v.vesselId)).filter(Boolean).length
}

export const removeDuplicatedVesselGroupvessels = (vessels: VesselGroupVesselIdentity[]) => {
  return uniqBy(vessels, (vessel) => [vessel.vesselId, vessel.dataset].join(','))
}
export const removeVesselGroupvesselIdentity = (vessels: VesselGroupVesselIdentity[]) => {
  return vessels.map(({ identity, ...vessel }) => vessel)
}
export const prepareVesselGroupVesselsUpdate = (vessels: VesselGroupVesselIdentity[]) => {
  return removeDuplicatedVesselGroupvessels(removeVesselGroupvesselIdentity(vessels))
}

export const getVesselGroupUniqVessels = (
  vessels: VesselGroupVesselIdentity[] | null
): VesselGroupVesselIdentity[] => {
  if (!vessels) {
    return []
  }
  return uniqBy(
    vessels.flatMap((vessel) => {
      const identities = getVesselIdentities(vessel.identity!, {
        identitySource: VesselIdentitySourceEnum.SelfReported,
      })
      if (!identities.length) {
        return []
      }
      return identities.map((identity) => ({
        vesselId: identity.id,
        dataset: identity.dataset as string,
        relationId: vessel.relationId as string,
        identity: (vessel.relationId === identity.id
          ? vessel.identity
          : undefined) as IdentityVessel,
      }))
    }),
    (v) => v.vesselId
  )
}

export const mergeVesselGroupVesselIdentities = (
  vesselGroupVessels: VesselGroupVessel[],
  vesselIdentities: IdentityVessel[]
): VesselGroupVesselIdentity[] => {
  return vesselGroupVessels
    .flatMap((v) => {
      const vesselIdentity = vesselIdentities.find((vesselIdentity) => {
        const selftReportedIds = getVesselIdentities(vesselIdentity, {
          identitySource: VesselIdentitySourceEnum.SelfReported,
        })?.map((v) => v.id)
        return selftReportedIds?.includes(v.vesselId)
      })
      if (!vesselIdentity) {
        return []
      }
      const relationId = getVesselId(vesselIdentity)
      return {
        ...v,
        relationId,
        identity: (relationId === v.vesselId ? vesselIdentity : undefined) as IdentityVessel,
      }
    })
    .toSorted((a, b) => {
      const aValue = getVesselProperty(a.identity!, 'shipname')
      const bValue = getVesselProperty(b.identity!, 'shipname')
      if (aValue === bValue) {
        return 0
      }
      return aValue > bValue ? 1 : -1
    })
}

export const flatVesselGroupSearchVessels = (
  vesselIdentities: IdentityVessel[]
): VesselGroupVesselIdentity[] => {
  return vesselIdentities
    .flatMap((vessel) => {
      const identities = getVesselIdentities(vessel, {
        identitySource: VesselIdentitySourceEnum.SelfReported,
      })
      if (!identities?.length) {
        return []
      }
      const relationId = getVesselId(vessel)
      return identities.map((i) => ({
        vesselId: i.id,
        dataset: i.dataset as string,
        relationId,
        identity: (relationId === i.id ? vessel : undefined) as IdentityVessel,
      }))
    })
    .toSorted((a, b) => {
      const aValue = getVesselProperty(a.identity!, 'shipname')
      const bValue = getVesselProperty(b.identity!, 'shipname')
      if (aValue === bValue) {
        return 0
      }
      return aValue > bValue ? 1 : -1
    })
}
