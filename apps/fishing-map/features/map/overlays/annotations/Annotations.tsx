import type { DragEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { useSetAtom } from 'jotai'

import { Tooltip } from '@globalfishingwatch/ui-components'

import { useMapViewport } from 'features/map/map-viewport.hooks'
import { overlaysCursorAtom } from 'features/map/overlays/overlays-hooks'

import { useMapAnnotation, useMapAnnotations } from './annotations.hooks'
import type { MapAnnotation } from './annotations.types'
// This blank image is needed to hide the default drag preview icon
// https://stackoverflow.com/questions/27989602/hide-drag-preview-html-drag-and-drop#comment136906877_27990218
const blankImage = new Image()
blankImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

const MapAnnotations = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const setOverlaysCursor = useSetAtom(overlaysCursorAtom)
  const xOffset = 390 // sidebar width
  const yOffset = 116 // timebar + map attribution + font height
  const { upsertMapAnnotations, mapAnnotations, areMapAnnotationsVisible } = useMapAnnotations()
  const { setMapAnnotation } = useMapAnnotation()
  const selectedAnnotationRef = useRef<number | null>(null)
  const [newCoords, setNewCoords] = useState<number[] | null>(null)
  const viewport = useMapViewport()

  const handleMouseEnter = useCallback(() => {
    setOverlaysCursor('pointer')
  }, [setOverlaysCursor])

  const handleMouseLeave = useCallback(() => {
    setOverlaysCursor('')
  }, [setOverlaysCursor])

  const handleDragStart = useCallback(
    ({ event, annotation }: { event: DragEvent; annotation: MapAnnotation }) => {
      if (!viewport) return
      setOverlaysCursor('move')
      event.dataTransfer.setDragImage(blankImage, 0, 0)
      event.dataTransfer.effectAllowed = 'none'
      selectedAnnotationRef.current = annotation.id
    },
    [setOverlaysCursor, viewport]
  )

  const handleDrag = useCallback(
    (event: DragEvent) => {
      if (!viewport) return
      setOverlaysCursor('move')
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
    [setOverlaysCursor, viewport]
  )

  const handleDragEnd = useCallback(
    (annotation: MapAnnotation) => {
      if (!viewport || !newCoords) return
      setOverlaysCursor('')
      upsertMapAnnotations({
        ...annotation,
        id: annotation.id || Date.now(),
        lon: newCoords[0],
        lat: newCoords[1],
      })
      setNewCoords(null)
    },
    [newCoords, setOverlaysCursor, upsertMapAnnotations, viewport]
  )

  if (!mapAnnotations || !areMapAnnotationsVisible) {
    return null
  }

  return (
    <div onPointerUp={(event) => event.preventDefault()}>
      <HtmlOverlay viewport={viewport} key="1">
        {mapAnnotations.map((annotation) => (
          <HtmlOverlayItem
            key={annotation.id}
            style={{
              pointerEvents: 'all',
              transform: 'translate(-50%,-50%)',
              maxWidth: '32rem',
              textAlign: 'center',
              fontWeight: 500,
            }}
            coordinates={
              (selectedAnnotationRef?.current === annotation.id && (newCoords as number[])) || [
                Number(annotation.lon),
                Number(annotation.lat),
              ]
            }
          >
            <p
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              tabIndex={0}
              onClick={(event) => {
                setMapAnnotation(annotation)
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ color: annotation.color }}
              draggable={true}
              onDragStart={(event) => handleDragStart({ event, annotation })}
              onDrag={handleDrag}
              onDragEnd={() => handleDragEnd(annotation)}
            >
              <Tooltip content={t('map.annotationsHover')}>
                <span>{annotation.label}</span>
              </Tooltip>
            </p>
          </HtmlOverlayItem>
        ))}
      </HtmlOverlay>
    </div>
  )
}

export default MapAnnotations
