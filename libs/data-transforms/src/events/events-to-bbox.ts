import { point } from '@turf/turf'
import type { Position } from 'geojson'

import type { ApiEvent } from '@globalfishingwatch/api-types'

import { getBboxFromPoints } from '../segments'
import type { Bbox } from '../types'

export function eventsToBbox(events: ApiEvent[]): Bbox {
  const points = events.flatMap((event) => {
    const lat = event.coordinates?.[1] || event?.position?.lat
    const lon = event.coordinates?.[0] || event?.position?.lon
    return lat && lon ? point([lon, lat] as Position) : []
  })
  return getBboxFromPoints(points)
}
