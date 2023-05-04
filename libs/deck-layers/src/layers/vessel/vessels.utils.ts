import { VesselTrackData } from '@globalfishingwatch/api-types'

export const getPathDefaultAccessor = (d: VesselTrackData) => d.waypoints.map((p) => p.coordinates)
export const getTimestampsDefaultAccessor = (d: VesselTrackData) =>
  d.waypoints.map((p) => p.timestamp)
