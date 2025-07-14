import { type IdentityVessel, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'
import { isRegistryInTimerange } from 'features/vessel/identity/VesselIdentitySelector'
import type { VesselIdentityProperty } from 'features/vessel/vessel.utils'
import { getVesselIdentities } from 'features/vessel/vessel.utils'

const CUSTOM_TURNING_TIDES_DATASET_PROPERTIES: Record<
  TurningTidesWorkspaceId,
  VesselIdentityProperty[]
> = {
  'turning_tides_testing-user-public': ['ssvid'],
  'tt-brazil-public': ['codMarinha'],
  'tt-chile-public': ['matricula'],
  'tt-peru-public': ['nationalId'],
}

const CUSTOM_TURNING_TIDES_SOURCECODE_PROPERTIES: Record<string, VesselIdentityProperty[]> = {
  'VMS Chile': ['matricula'],
  'VMS Brazil': ['codMarinha'],
  'VMS Brazil Onyxsat': ['codMarinha'],
  'VMS Peru': ['nationalId'],
}

export function getCustomVesselPropertiesByWorkspaceId(
  workspaceId: TurningTidesWorkspaceId,
  vesselInfo: IdentityVessel,
  {
    start,
    end,
  }: {
    start: string
    end: string
  }
) {
  let customProperties = CUSTOM_TURNING_TIDES_DATASET_PROPERTIES[workspaceId]

  const sourceCode = vesselInfo?.selfReportedInfo?.[0]?.sourceCode
  if (typeof sourceCode === 'string' && CUSTOM_TURNING_TIDES_SOURCECODE_PROPERTIES[sourceCode]) {
    customProperties = CUSTOM_TURNING_TIDES_SOURCECODE_PROPERTIES[sourceCode]
  }
  if (!workspaceId || !vesselInfo || !customProperties) {
    return {}
  }
  return Object.fromEntries(
    customProperties.map((property) => {
      const identities = getVesselIdentities(vesselInfo, {
        identitySource: VesselIdentitySourceEnum.SelfReported,
      })
      const identity =
        start && end
          ? identities.find((v) => isRegistryInTimerange(v, start, end))
          : identities[identities.length - 1]
      return [property, (identity as any)[property] || '']
    })
  )
}
