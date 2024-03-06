import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { DragEvent, useCallback } from 'react'
import { Viewport } from '@deck.gl/core/typed'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import { useDeckMap } from '../map-context.hooks'
import { useMapViewport } from '../map-viewport.hooks'
import { MapAnnotation } from './annotations.types'

const MapAnnotations = (): React.ReactNode | null => {
  const { upsertMapAnnotations, mapAnnotations, areMapAnnotationsVisible } = useMapAnnotations()
  const { setMapAnnotation } = useMapAnnotation()
  const deck = useDeckMap()
  const viewport: Viewport | undefined = useMapViewport()
  const handleHover = useCallback(() => {
    deck?.setProps({ getCursor: () => 'move' })
  }, [deck])
  const handleMouseLeave = useCallback(() => {
    deck?.setProps({ getCursor: () => 'grab' })
  }, [deck])
  const handleDragStart = useCallback(() => {
    deck?.setProps({ controller: { dragPan: false } })
  }, [deck])
  const handleDrag = useCallback(() => {
    deck?.setProps({ getCursor: () => 'move' })
  }, [deck])
  const handleDragEnd = useCallback(
    ({ event, annotation }: { event: DragEvent; annotation: MapAnnotation }) => {
      if (!viewport) return
      deck?.setProps({ controller: { dragPan: true }, getCursor: () => 'grab' })
      const newCoords = viewport.unproject([event.clientX - 390, event.clientY])
      upsertMapAnnotations({
        ...annotation,
        id: annotation.id || Date.now(),
        lon: newCoords[0],
        lat: newCoords[1],
      })
    },
    [deck, upsertMapAnnotations, viewport]
  )

  return (
    <HtmlOverlay viewport={viewport} key="1">
      {deck &&
        mapAnnotations &&
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
              onMouseEnter={handleHover}
              onMouseLeave={handleMouseLeave}
              style={{ color: annotation.color }}
              draggable={true}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
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
