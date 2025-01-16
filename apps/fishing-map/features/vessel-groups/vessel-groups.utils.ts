import { uniq, uniqBy } from 'es-toolkit'

import type { IdentityVessel, VesselGroup, VesselGroupVessel } from '@globalfishingwatch/api-types'
import { SelfReportedSource, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { PUBLIC_SUFIX } from 'data/config'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselId, getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'

import { VESSEL_GROUPS_REPORT_RELEASE_DATE } from './vessel-groups.config'
import type { AddVesselGroupVessel } from './vessel-groups.hooks'
import type { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'

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
  const vesselIdentityIds = vesselIdentities.map((vesselIdentity) =>
    getVesselIdentities(vesselIdentity, {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })?.map((v) => v.id)
  )
  return vesselGroupVessels
    .flatMap((v) => {
      const vesselIdentity = vesselIdentities.find((_, index) => {
        return vesselIdentityIds[index]?.includes(v.vesselId)
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
  return vesselIdentities.flatMap((vessel) => {
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
}

export function parseVesselGroupVessels(
  vessels: AddVesselGroupVessel[]
): VesselGroupVesselIdentity[] {
  return vessels?.flatMap((vessel) => {
    if ((vessel as IdentityVesselData).identities?.length) {
      const identityVessel = vessel as IdentityVesselData
      const selfReportedIdentities = identityVessel.identities?.filter(
        (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
      )
      if (selfReportedIdentities?.length) {
        const relationId = identityVessel.id
        return {
          vesselId: identityVessel.id,
          dataset: identityVessel.datasetId || (identityVessel.dataset?.id as string),
          relationId: relationId,
          identity:
            relationId === identityVessel.id
              ? {
                  dataset: identityVessel.datasetId || identityVessel.dataset?.id,
                  selfReportedInfo: selfReportedIdentities,
                }
              : undefined,
        } as VesselGroupVesselIdentity
      }
      return []
    }
    return vessel as VesselGroupVesselIdentity
  })
}

export const getVesselsWithoutDuplicates = (vessels: VesselGroupVesselIdentity[]) => {
  return vessels.filter((v) => v.identity !== undefined)
}

export function calculateVMSVesselsPercentage(vessels: VesselGroupVesselIdentity[] | null): number {
  if (!vessels || vessels.length === 0) return 0

  const vesselsWithVMS = vessels.filter((vessel) => {
    const selfReportedInfo = vessel.identity?.selfReportedInfo
    if (!Array.isArray(selfReportedInfo)) return false

    return selfReportedInfo.some(
      (info) => Array.isArray(info.sourceCode) && !info.sourceCode.includes(SelfReportedSource.Ais)
    )
  })

  return Math.round((vesselsWithVMS.length / vessels.length) * 100)
}
