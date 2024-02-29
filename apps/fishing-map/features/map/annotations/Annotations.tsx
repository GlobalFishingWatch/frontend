import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { DragEvent, DragEventHandler, useCallback, useState } from 'react'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import { MapAnnotation, MapAnnotationComponentProps } from './annotations.types'

const MapAnnotations = (props: MapAnnotationComponentProps): React.ReactNode | null => {
  const { viewport, deckRef } = props
  const { upsertMapAnnotations, mapAnnotations, areMapAnnotationsVisible } = useMapAnnotations()
  const { setMapAnnotation } = useMapAnnotation()
  const [newCoordinates, setNewCoordinates] = useState([0, 0])

  const handleDragStart = useCallback(() => {
    deckRef?.deck?.setProps({ controller: { dragPan: false } })
  }, [deckRef?.deck])
  // const handleDrag: DragEventHandler = useCallback(
  //   (event) => {
  //     setNewCoordinates(viewport.unproject([event.clientX - 390, event.clientY]))
  //   },
  //   [viewport]
  // )
  const handleDragEnd = useCallback(
    ({ event, annotation }: { event: DragEvent; annotation: MapAnnotation }) => {
      deckRef?.deck?.setProps({ controller: { dragPan: true } })
      const newCoords = viewport.unproject([event.clientX - 390, event.clientY])
      // setNewCoordinates(viewport.unproject([event.clientX - 390, event.clientY]))
      upsertMapAnnotations({
        ...annotation,
        id: annotation.id || Date.now(),
        lon: newCoords[0],
        lat: newCoords[1],
      })
    },
    [deckRef?.deck, upsertMapAnnotations, viewport]
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
              onClick={(event) => {
                setMapAnnotation(annotation)
              }}
              style={{ color: annotation.color }}
              draggable={true}
              onDragStart={handleDragStart}
              // onDrag={handleDrag}
              onDragEnd={(event) => handleDragEnd({ event, annotation })}
            >
              {annotation.label}
            </p>
          </HtmlOverlayItem>
        ))}
    </HtmlOverlay>
  )
}

export default MapAnnotations
