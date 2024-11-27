import { TrackPoint } from '@globalfishingwatch/api-types'
import { ActionType, LayersData, VesselPoint } from '../../types'

export const getTimebarPoints = (
  vesselTrack: LayersData[],
  date: { start: number; end: number },
  filterMode: string,
  values: { max: string; min: string }
) => {
  const eventsWithRenderingInfo: VesselPoint[] = vesselTrack.flatMap((data: LayersData) => {
    return data.trackPoints.map((vesselMovement: TrackPoint) => {
      const outOfTimeRange =
        date.start >= vesselMovement?.timestamp! || vesselMovement?.timestamp! >= date.end
      const filterModeValue: number = vesselMovement[filterMode as keyof TrackPoint] as number
      const outOfFilterRange =
        filterModeValue < Number(values.min) || filterModeValue > Number(values.max)
      const outOfRange = outOfTimeRange || outOfFilterRange

      return {
        timestamp: vesselMovement.timestamp,
        speed: vesselMovement.speed,
        fishing: false,
        course: vesselMovement.course,
        elevation: vesselMovement.elevation,
        action: data.action || ActionType.untracked,
        position: { lat: vesselMovement.latitude, lon: vesselMovement.longitude },
        outOfRange,
      } as VesselPoint
    })
  })
  return eventsWithRenderingInfo
}
