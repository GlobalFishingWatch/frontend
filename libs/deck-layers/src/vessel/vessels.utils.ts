export const getPathDefaultAccessor = (d) => d.waypoints.map((p) => p.coordinates)
export const getTimestampsDefaultAccessor = (d) => d.waypoints.map((p) => p.timestamp)
