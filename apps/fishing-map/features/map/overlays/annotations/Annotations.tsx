import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { DragEvent, useCallback, useRef, useState } from 'react'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { useMapAnnotation, useMapAnnotations } from './annotations.hooks'
import { MapAnnotation } from './annotations.types'
// This blank image is needed to hide the default drag preview icon
// https://stackoverflow.com/questions/27989602/hide-drag-preview-html-drag-and-drop#comment136906877_27990218
const blankImage = new Image()
blankImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

const MapAnnotations = (): React.ReactNode | null => {
  const xOffset = 390 // sidebar width
  const yOffset = 116 // timebar + map attribution + font height
  const { upsertMapAnnotations, mapAnnotations, areMapAnnotationsVisible } = useMapAnnotations()
  const { setMapAnnotation } = useMapAnnotation()
  const deck = useDeckMap()
  const selectedAnnotationRef = useRef<number | null>(null)
  const [newCoords, setNewCoords] = useState<number[] | null>(null)
  const viewport = useMapViewport()
  const handleHover = useCallback(() => {
    deck?.setProps({ getCursor: () => 'move' })
  }, [deck])
  const handleMouseLeave = useCallback(() => {
    deck?.setProps({ getCursor: () => 'grab' })
  }, [deck])
  const handleDragStart = useCallback(
    ({ event, annotation }: { event: DragEvent; annotation: MapAnnotation }) => {
      if (!viewport) return
      deck?.setProps({ controller: { dragPan: false } })
      event.dataTransfer.setDragImage(blankImage, 0, 0)
      event.dataTransfer.effectAllowed = 'none'
      selectedAnnotationRef.current = annotation.id
    },
    [deck, viewport]
  )
  const handleDrag = useCallback(
    (event: DragEvent) => {
      if (!viewport) return
      deck?.setProps({ getCursor: () => 'move' })
      if (event.clientX && event.clientY) {
        const x = event.clientX - xOffset > 0 ? event.clientX - xOffset : 0
        const y =
          event.clientY < window.innerHeight - yOffset
            ? event.clientY
            : window.innerHeight - yOffset
        const coords = viewport.unproject([x, y])
        setNewCoords(coords)
      }
    },
    [deck, viewport]
  )
  const handleDragEnd = useCallback(
    (annotation: MapAnnotation) => {
      if (!viewport || !newCoords) return
      deck?.setProps({ controller: { dragPan: true }, getCursor: () => 'grab' })
      upsertMapAnnotations({
        ...annotation,
        id: annotation.id || Date.now(),
        lon: newCoords[0],
        lat: newCoords[1],
      })
      setNewCoords(null)
    },
    [deck, newCoords, upsertMapAnnotations, viewport]
  )

  if (!deck || !mapAnnotations || !areMapAnnotationsVisible) {
    return null
  }

  return (
    <div onPointerUp={(event) => event.preventDefault()}>
      <HtmlOverlay viewport={viewport} key="1">
        {mapAnnotations.map((annotation) => (
          <HtmlOverlayItem
            key={annotation.id}
            style={{ pointerEvents: 'all', transform: 'translate(-50%,-50%)' }}
            coordinates={
              (selectedAnnotationRef?.current === annotation.id && (newCoords as number[])) || [
                Number(annotation.lon),
                Number(annotation.lat),
              ]
            }
          >
            <p
              onClick={(event) => {
                setMapAnnotation(annotation)
              }}
              onMouseEnter={handleHover}
              onMouseLeave={handleMouseLeave}
              style={{ color: annotation.color }}
              draggable={true}
              onDragStart={(event) => handleDragStart({ event, annotation })}
              onDrag={handleDrag}
              onDragEnd={() => handleDragEnd(annotation)}
            >
              {annotation.label}
            </p>
          </HtmlOverlayItem>
        ))}
      </HtmlOverlay>
    </div>
  )
}

export default MapAnnotations
