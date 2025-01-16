import { point } from '@turf/helpers'
import type { Position } from 'geojson'

import type { ApiEvent } from '@globalfishingwatch/api-types'

import { getBboxFromPoints } from '../segments'
import type { BBox } from '../types'

export function eventsToBbox(events: ApiEvent[]): BBox {
  const points = events.flatMap((event) => {
    const { lat, lon } = event?.position || {}
    return lat && lon ? point([lon, lat] as Position) : []
  })
  return getBboxFromPoints(points)
}
