import { point } from '@turf/helpers'
import { Position } from 'geojson'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { BBox } from '../types'
import { getBboxFromPoints } from '../segments'

export function eventsToBbox(events: ApiEvent[]): BBox {
  const points = events.flatMap((event) => {
    const { lat, lon } = event?.position || {}
    return lat && lon ? point([lon, lat] as Position) : []
  })
  return getBboxFromPoints(points)
}
