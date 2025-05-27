import { getAreaWorkspaceConfig } from './area/area-workspace'
import { getPortWorkspaceConfig } from './port/port-workspace'
import { getVesselWorkspaceConfig } from './vessel/vessel-workspace'
import type { ConfigurationParams } from './types'

export async function getWorkspaceConfig(configuration: ConfigurationParams) {
  const vesselWorkspace = await getVesselWorkspaceConfig(configuration)
  if (vesselWorkspace) {
    return vesselWorkspace
  }

  const portWorkspace = await getPortWorkspaceConfig(configuration)
  if (portWorkspace) {
    return portWorkspace
  }

  const areaWorkspace = await getAreaWorkspaceConfig(configuration)
  if (areaWorkspace) {
    return areaWorkspace
  }

  return
}
