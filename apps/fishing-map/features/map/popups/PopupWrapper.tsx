import { useRef } from 'react'
import type { Middleware } from '@floating-ui/react'
import {
  arrow,
  autoPlacement,
  autoUpdate,
  detectOverflow,
  FloatingArrow,
  offset,
  useFloating,
} from '@floating-ui/react'
import cx from 'classnames'

import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapViewport } from 'features/map/map-viewport.hooks'
import useClickedOutside from 'hooks/use-clicked-outside'

import { MAP_WRAPPER_ID } from '../map.config'

import styles from './Popup.module.css'

const overflowMiddlware: Middleware = {
  name: 'overflow',
  async fn(state) {
    const boundary = document.getElementById(MAP_WRAPPER_ID)
    if (!state || !boundary) {
      return {}
    }

    const overflow = await detectOverflow(state, { boundary })
    const { x, y } = state

    return {
      ...state,
      x: overflow.left > 0 ? x + overflow.left : overflow.right > 0 ? x - overflow.right : x,
      y: overflow.top > 0 ? y + overflow.top : overflow.bottom > 0 ? y - overflow.bottom : y,
    }
  },
}

type PopupWrapperProps = {
  latitude: InteractionEvent['latitude'] | null
  longitude: InteractionEvent['longitude'] | null
  showArrow?: boolean
  showClose?: boolean
  className?: string
  onClose?: () => void
  children: React.ReactNode
}

function PopupWrapper({
  latitude,
  longitude,
  showArrow = true,
  showClose = true,
  className = '',
  onClose,
  children,
}: PopupWrapperProps) {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const mapViewport = useMapViewport()

  const arrowRef = useRef<SVGSVGElement>(null)
  const clickOutsideRef = useClickedOutside(onClose)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [
      offset(15),
      autoPlacement({
        allowedPlacements: ['top', 'bottom'],
        padding: 10,
      }),
      overflowMiddlware,
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
      ref={refs.setReference}
      style={{ position: 'absolute', top, left, zIndex: 2 }}
      className={cx(styles.popup, className)}
    >
      <div className={styles.contentWrapper} ref={refs.setFloating} style={floatingStyles}>
        {showArrow && <FloatingArrow fill="white" ref={arrowRef} context={context} />}
        {showClose && onClose !== undefined && (
          <div className={styles.close}>
            <IconButton type="invert" size="small" icon="close" onClick={onClose} />
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
