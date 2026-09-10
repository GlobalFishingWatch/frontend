import { useEffect, useMemo, useRef } from 'react'
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  hide,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react'
import cx from 'classnames'

import { toLngLatCoordinates } from '@globalfishingwatch/data-transforms'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { getMapViewport, MAP_CONTAINER_ID } from 'features/_map/map/map-viewport.hooks'
import useClickedOutside from 'hooks/use-clicked-outside'
import { getSafeElementById } from 'utils/dom'

import styles from './Popup.module.css'

const getBoundary = () => getSafeElementById(MAP_CONTAINER_ID) || undefined
const OFF_MAP_RECT = () => new DOMRect(-1e5, -1e5, 0, 0)

type PopupWrapperProps = {
  latitude: InteractionEvent['latitude'] | null
  longitude: InteractionEvent['longitude'] | null
  showArrow?: boolean
  showClose?: boolean
  className?: string
  onClose?: () => void
  onClickOutside?: () => void
  children: React.ReactNode
}

function PopupWrapper({
  latitude,
  longitude,
  showArrow = true,
  showClose = true,
  className = '',
  onClose,
  onClickOutside,
  children,
}: PopupWrapperProps) {
  const deckMap = useDeckMap()
  const boundary = getBoundary()

  const arrowRef = useRef<SVGSVGElement>(null)
  const clickOutsideRef = useClickedOutside(onClickOutside)

  const reference = useMemo(() => {
    const point = toLngLatCoordinates(longitude, latitude)
    return {
      contextElement: boundary || undefined,
      getBoundingClientRect: () => {
        const viewport = getMapViewport(deckMap)
        const container = boundary?.getBoundingClientRect()
        if (!point || !viewport || !container) {
          return OFF_MAP_RECT()
        }
        const [x, y] = viewport.project(point)
        return new DOMRect(container.left + x, container.top + y, 0, 0)
      },
    }
  }, [boundary, deckMap, latitude, longitude])

  const { refs, floatingStyles, context, middlewareData } = useFloating({
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, { animationFrame: true }),
    placement: 'top',
    middleware: [
      offset(15),
      flip({
        fallbackPlacements: ['bottom', 'left', 'right'],
        boundary,
        padding: 10,
      }),
      shift({
        boundary,
        padding: 10,
      }),
      size({
        boundary,
        padding: 10,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty('--popup-available-height', `${availableHeight}px`)
        },
      }),
      // eslint-disable-next-line react-hooks/refs
      arrow({
        element: arrowRef,
        padding: -5,
      }),
      hide({ boundary }),
    ],
  })

  useEffect(() => {
    refs.setPositionReference(reference)
  }, [refs, reference])

  if (!toLngLatCoordinates(longitude, latitude)) {
    return null
  }
  return (
    <div
      ref={refs.setFloating}
      className={cx(styles.popup, className, 'notranslate')}
      style={{
        ...floatingStyles,
        visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
        zIndex: 2,
      }}
      translate="no"
    >
      <div className={styles.contentWrapper} data-testid="map-popup-wrapper">
        {showArrow && <FloatingArrow fill="white" ref={arrowRef} context={context} />}
        {showClose && onClose !== undefined && (
          <div className={styles.close}>
            <IconButton
              type="invert"
              size="small"
              icon="close"
              onClick={onClose}
              testId="close-popup-button"
            />
          </div>
        )}
        <div ref={clickOutsideRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PopupWrapper
