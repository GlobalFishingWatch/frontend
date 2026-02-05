import { getAreaReportConfig, getGlobalReportConfig } from './area/area-workspace'
import { getPortProfileConfig } from './port/port-workspace'
import { getVesselProfileConfig } from './vessel/vessel-workspace'
import type { ConfigurationParams } from './types'

export async function getWorkspaceConfig(configuration: ConfigurationParams) {
  const vesselProfile = await getVesselProfileConfig(configuration)
  if (vesselProfile) {
    return vesselProfile
  }

  const portProfile = await getPortProfileConfig(configuration)
  if (portProfile) {
    return portProfile
  }

  const areaReport = await getAreaReportConfig(configuration)
  if (areaReport) {
    return areaReport
  }

  const globalReport = await getGlobalReportConfig(configuration)
  if (globalReport) {
    return globalReport
  }

  return
}
