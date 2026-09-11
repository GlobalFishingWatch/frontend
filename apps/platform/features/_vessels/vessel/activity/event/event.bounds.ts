import { useCallback } from 'react'
import { bbox, bboxPolygon, booleanPointInPolygon, featureCollection, point } from '@turf/turf'
import type { Point, Polygon, Position } from 'geojson'

import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { useMapFitBounds } from 'features/_map/map/map-bounds.hooks'
import type { VesselEvent } from 'features/_vessels/vessel/vessel.types'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { Bbox } from 'types'

export function useVesselEventBounds(vesselLayer: DeckLayerAtom<VesselLayer>) {
  const isSmallScreen = useSmallScreen()
  const fitMapBounds = useMapFitBounds()
  const { replaceQueryParams } = useReplaceQueryParams()

  const fitEventBounds = useCallback(
    (event: VesselEvent) => {
      if (!event) {
        return
      }
      if (vesselLayer?.instance) {
        const trackBounds = vesselLayer?.instance.getVesselTrackBounds({
          startDate: event.start,
          endDate: event.end,
        })
        const eventCoordinates = event.coordinates
          ? [...(event.coordinates as Position)]
          : undefined
        if (eventCoordinates && trackBounds && trackBounds[2] > 180 && eventCoordinates[0] < 0) {
          eventCoordinates[0] += 360
        }
        const trackPolygon = trackBounds ? bboxPolygon(trackBounds) : undefined
        const eventPoint = eventCoordinates ? point(eventCoordinates) : undefined
        // filter segments to use only the ones actually overlapping with the event
        const eventTrackPolygon =
          !eventPoint || (trackPolygon && booleanPointInPolygon(eventPoint, trackPolygon))
            ? trackPolygon
            : undefined
        if (!eventTrackPolygon && !eventPoint) {
          return
        }
        const bounds = bbox(
          featureCollection<Polygon | Point, any>([
            ...(eventTrackPolygon ? [eventTrackPolygon] : []),
            ...(eventPoint ? [eventPoint] : []),
          ])
        ) as Bbox
        if (bounds) {
          fitMapBounds(bounds, { padding: 60, fitZoom: true, flyTo: true, maxZoom: 18 })
        }
      }
      if (isSmallScreen) {
        replaceQueryParams({ sidebarOpen: false })
      }
    },
    [fitMapBounds, isSmallScreen, replaceQueryParams, vesselLayer?.instance]
  )

  return fitEventBounds
}
