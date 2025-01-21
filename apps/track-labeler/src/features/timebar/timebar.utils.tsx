import type { TrackPoint } from '@globalfishingwatch/api-types'

import type { FilterModeValues,LayersData, VesselPoint } from '../../types'
import { ActionType } from '../../types'

const getIsOutOfFilterRange = ({
  value,
  filterModeValues,
  filterMode,
}: {
  value: number
  filterModeValues: FilterModeValues
  filterMode: string
}) => {
  if (!filterModeValues[filterMode]) return false
  const max = Number(filterModeValues[filterMode].max)
  const min = Number(filterModeValues[filterMode].min)
  return value < min || value > max
}

export const getTimebarPoints = (
  vesselTrack: LayersData[],
  date: { start: number; end: number },
  filterMode: string,
  filterModeValues: FilterModeValues
) => {
  const eventsWithRenderingInfo: VesselPoint[] = vesselTrack.flatMap((data: LayersData) => {
    return data.trackPoints.map((vesselMovement: TrackPoint) => {
      const outOfTimeRange =
        vesselMovement?.timestamp &&
        (date.start >= vesselMovement?.timestamp || vesselMovement?.timestamp >= date.end)
      const value: number = vesselMovement[filterMode as keyof TrackPoint] as number
      const outOfFilterRange = getIsOutOfFilterRange({ value, filterModeValues, filterMode })
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

export const getMaxMinVesselPointsByProperty = (vesselPoints: VesselPoint[], property: string) => {
  const min = Math.min(
    ...vesselPoints.map((point) => point[property as keyof VesselPoint] as number)
  )
  const max = Math.max(
    ...vesselPoints.map((point) => point[property as keyof VesselPoint] as number)
  )
  return { min, max }
}
