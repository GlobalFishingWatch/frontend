import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import type { ConfigurationParams } from '../types'
import { getSharedWorkspaceParams } from '../utils'

import { searchVessels } from './vessel-search'

export async function getVesselWorkspaceConfig(configuration: ConfigurationParams) {
  const { vessel } = configuration
  if (vessel?.name || vessel?.imo || vessel?.mmsi) {
    const vesselsMatched = await searchVessels(vessel)
    if (!vesselsMatched) {
      return
    }
    const query = stringifyWorkspace(getSharedWorkspaceParams(configuration))

    const links = vesselsMatched.map((vesselMatched) => ({
      url: `/map/vessel/${vesselMatched.id}?${query}&dataset=${vesselMatched.dataset}`,
      message: `${vesselMatched.name} (${vesselMatched.mmsi})`,
    }))
    return {
      label: '',
      links,
    }
  }
}
