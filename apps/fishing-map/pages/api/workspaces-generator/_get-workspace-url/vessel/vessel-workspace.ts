import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import type { ConfigurationParams } from '../types'
import { getSharedWorkspaceParams } from '../utils'

import { searchVessel } from './vessel-search'

export async function getVesselWorkspaceConfig(configuration: ConfigurationParams) {
  const { vessel } = configuration
  if (vessel?.name || vessel?.imo || vessel?.mmsi) {
    const vesselMatched = await searchVessel(vessel)
    if (!vesselMatched) {
      return
    }
    const { id, name, dataset } = vesselMatched
    const query = stringifyWorkspace(getSharedWorkspaceParams(configuration))
    return {
      label: `Here you have the vessel ${name} profile`,
      url: `/map/vessel/${id}?${query}&dataset=${dataset}`,
    }
  }
}
