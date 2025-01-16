import type { VesselSearch } from '@globalfishingwatch/api-types'

import { VesselAPISource } from 'types'
import type { Position } from 'types/activity'

export function getVesselAPISource(vessel: VesselSearch): VesselAPISource[] {
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

export const cheapDistance = (coordA: Position, coordB: Position) => {
  const longitudeΔ = coordA.lon - coordB.lon
  const latitudeΔ = coordA.lat - coordB.lat
  return Math.sqrt(longitudeΔ * longitudeΔ + latitudeΔ * latitudeΔ)
}
