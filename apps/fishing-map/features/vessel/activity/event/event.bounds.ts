import { useCallback } from 'react'
import bbox from '@turf/bbox'
import { featureCollection, point } from '@turf/helpers'
import { bboxPolygon } from '@turf/turf'
import type { Point, Polygon, Position } from 'geojson'

import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import type { VesselEvent } from 'features/vessel/activity/event/Event'
import { useLocationConnect } from 'routes/routes.hook'
import type { Bbox } from 'types'

export function useVesselEventBounds(vesselLayer: DeckLayerAtom<VesselLayer>) {
  const isSmallScreen = useSmallScreen()
  const { dispatchQueryParams } = useLocationConnect()
  const fitMapBounds = useMapFitBounds()

  const fitEventBounds = useCallback(
    (event: VesselEvent) => {
      if (!event) {
        return
      }
      if (vesselLayer?.instance) {
        const trackBounds = vesselLayer.instance.getVesselTrackBounds({
          startDate: event.start,
          endDate: event.end,
        })
        const bounds = bbox(
          featureCollection<Polygon | Point, any>([
            ...(trackBounds ? [bboxPolygon(trackBounds)] : []),
            ...(event.coordinates ? [point(event.coordinates as Position)] : []),
          ])
        ) as Bbox
        if (bounds) {
          fitMapBounds(bounds, { padding: 60, fitZoom: true, flyTo: true, maxZoom: 18 })
        }
      }
      if (isSmallScreen) {
        dispatchQueryParams({ sidebarOpen: false })
      }
    },
    [dispatchQueryParams, fitMapBounds, isSmallScreen, vesselLayer?.instance]
  )

  return fitEventBounds
}
