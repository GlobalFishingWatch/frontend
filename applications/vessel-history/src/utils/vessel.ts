import { Vessel, VesselAPISource } from 'types'

export function getVesselAPISource(vessel: Vessel): VesselAPISource[] {
  const source = []
  if (vessel.id) source.push(VesselAPISource.GFW)
  if (vessel.vesselMatchId) source.push(VesselAPISource.TMT)
  return source
}

export function getVesselValueSource(gfwValue: any, tmtValue: any): VesselAPISource[] {
  const source = []
  if (gfwValue) source.push(VesselAPISource.GFW)
  if (tmtValue) source.push(VesselAPISource.TMT)
  return source
}
