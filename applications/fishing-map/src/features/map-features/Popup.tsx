import React from 'react'
import { Popup } from '@globalfishingwatch/react-map-gl'
import { TooltipEvent } from '@globalfishingwatch/react-hooks'
import styles from './Popup.module.css'

function PopupWrapper({
  tooltipEvent,
  closeButton = false,
  closeOnClick = false,
  className,
  onClose,
}: {
  tooltipEvent: TooltipEvent
  closeButton?: boolean
  closeOnClick?: boolean
  className: string
  onClose?: () => void
}) {
  return (
    <Popup
      latitude={tooltipEvent.latitude}
      longitude={tooltipEvent.longitude}
      closeButton={closeButton}
      closeOnClick={closeOnClick}
      onClose={onClose}
      anchor="top"
    >
      <div className={`${styles.popup} ${className}`}>
        {tooltipEvent.features.map((feature, i) => (
          <div key={i} className={styles.popupSection}>
            <h3>
              <span
                className={styles.popupSectionColor}
                style={{ backgroundColor: feature.color }}
              />
              {feature.title}
            </h3>
            <p>
              {feature.value} {feature.unit}
            </p>
          </div>
        ))}
      </div>
    </Popup>
  )
}

export function HoverPopup({ event }: { event: TooltipEvent | null }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} className={styles.hover} />
  }
  return null
}

export function ClickPopup({
  event,
  onClose,
}: {
  event: TooltipEvent | null
  onClose?: () => void
}) {
  if (event && event.features) {
    return (
      <PopupWrapper
        tooltipEvent={event}
        closeButton={true}
        closeOnClick={true}
        className={styles.click}
        onClose={onClose}
      />
    )
  }
  return null
}
