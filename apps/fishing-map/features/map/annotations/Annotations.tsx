import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { DragEventHandler, useCallback, useState } from 'react'
import { useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import { MapAnnotation, MapAnnotationComponentProps } from './annotations.types'

const MapAnnotations = (props: MapAnnotationComponentProps): React.ReactNode | null => {
  const { viewport, deckRef } = props
  const { upsertMapAnnotations, mapAnnotations, areMapAnnotationsVisible } = useMapAnnotations()
  const [newCoordinates, setNewCoordinates] = useState([0, 0])

  const handleDragStart = useCallback(() => {
    deckRef?.deck?.setProps({ controller: { dragPan: false } })
  }, [deckRef?.deck])
  const handleDrag: DragEventHandler = useCallback(
    (event) => {
      setNewCoordinates(
        viewport.unproject([viewport.width - event.clientX, viewport.height - event.clientY])
      )
    },
    [viewport]
  )
  const handleDragEnd = useCallback(
    (mapAnnotation: MapAnnotation) => {
      deckRef?.deck?.setProps({ controller: { dragPan: true } })
      upsertMapAnnotations({
        ...mapAnnotation,
        id: mapAnnotation.id || Date.now(),
        lon: newCoordinates[0],
        lat: newCoordinates[1],
      })
    },
    [deckRef?.deck, upsertMapAnnotations, newCoordinates]
  )

  return (
    <HtmlOverlay {...props} key="1">
      {mapAnnotations &&
        areMapAnnotationsVisible &&
        mapAnnotations.map((annotation) => (
          <HtmlOverlayItem
            key={annotation.id}
            style={{ pointerEvents: 'all' }}
            coordinates={[Number(annotation.lon), Number(annotation.lat)]}
          >
            <p
              style={{ color: annotation.color }}
              draggable={true}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={() => handleDragEnd(annotation)}
            >
              {annotation.label}
            </p>
          </HtmlOverlayItem>
        ))}
    </HtmlOverlay>
  )
}

export default MapAnnotations
