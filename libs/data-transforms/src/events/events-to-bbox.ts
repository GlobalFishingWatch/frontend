import { point } from '@turf/helpers'
import type { Position } from 'geojson'
import type { ApiEvent } from '@globalfishingwatch/api-types'
import type { BBox } from '../types'
import { getBboxFromPoints } from '../segments'

export function eventsToBbox(events: ApiEvent[]): BBox {
  const points = events.flatMap((event) => {
    const { lat, lon } = event?.position || {}
    return lat && lon ? point([lon, lat] as Position) : []
  })
  return getBboxFromPoints(points)
}
