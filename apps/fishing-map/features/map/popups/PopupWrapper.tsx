import { useRef } from 'react'
import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useFloating } from '@floating-ui/react'
import cx from 'classnames'

import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapViewport } from 'features/map/map-viewport.hooks'
import useClickedOutside from 'hooks/use-clicked-outside'

import { MAP_WRAPPER_ID } from '../map.config'

import styles from './Popup.module.css'

const getBoundary = () => document.getElementById(MAP_WRAPPER_ID) ?? undefined

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
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const mapViewport = useMapViewport()

  const arrowRef = useRef<SVGSVGElement>(null)
  const clickOutsideRef = useClickedOutside(onClickOutside)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [
      offset(15),
      flip({
        fallbackPlacements: ['bottom'],
        boundary: getBoundary(),
        padding: 10,
      }),
      shift({
        boundary: getBoundary(),
        padding: 10,
      }),
      // eslint-disable-next-line react-hooks/refs
      arrow({
        element: arrowRef,
        padding: -5,
      }),
    ],
  })

  if (!mapViewport || !latitude || !longitude) return null
  const [left, top] = mapViewport.project([longitude, latitude])
  return (
    <div
      // eslint-disable-next-line react-hooks/refs
      ref={refs.setReference}
      style={{ position: 'absolute', top, left, zIndex: 2 }}
      className={cx(styles.popup, className, 'notranslate')}
      translate="no"
    >
      <div
        // eslint-disable-next-line react-hooks/refs
        ref={refs.setFloating}
        className={styles.contentWrapper}
        style={floatingStyles}
        data-testid="map-popup-wrapper"
      >
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
