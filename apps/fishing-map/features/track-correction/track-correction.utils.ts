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
  'tt-brazil-public': ['codMarinha', 'matricula'],
  'tt-chile-public': ['matricula'],
  'tt-peru-public': [],
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
  const customProperties = CUSTOM_TURNING_TIDES_DATASET_PROPERTIES[workspaceId]
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
